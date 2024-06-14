import React, { createContext, ReactNode, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { IListing, IReview } from '../models';
import {
	NumberOfBathroomsEnum,
	NumberOfBedroomsEnum,
	PropertyTypeEnum,
	SearchTypeEnum,
	TypeOfProviderEnum
} from '../enums';
import {
	BUCHAREST_COORDINATES,
	callApi,
	DEFAULT_LATITUDE_DELTA,
	DEFAULT_LONGITUDE_DELTA,
	MAX_PRICE,
	MIN_PRICE
} from '../utils';
import { useListings } from '../hooks';
import RentalAmenitiesEnum from '../enums/RentalAmenitiesEnum';

export interface SearchContextState {
	isWaitingForSearch: boolean,
	wasExternalSearchPerformed: boolean,
	region: {
		latitude: number,
		longitude: number,
		latitudeDelta: number,
		longitudeDelta: number,
	},
	searchType: SearchTypeEnum,
	listings: IListing[],
	reviews: IReview[],
	filteredListings: IListing[],
	filteredReviews: IReview[],
	filters: {
		roomType?: PropertyTypeEnum,
		priceRange?: { min: number, max: number },
		bedrooms?: number,
		bathrooms?: number,
		amenities: RentalAmenitiesEnum[],
		provider: TypeOfProviderEnum,
	},
}

const SearchContext = createContext<{
	triggerSearch: (newRegion, wasExternal) => void,
	state: SearchContextState,
	setRegion: React.Dispatch<React.SetStateAction<SearchContextState['region']>>,
	setSearchType: React.Dispatch<React.SetStateAction<SearchTypeEnum>>,
	setListings: React.Dispatch<React.SetStateAction<IListing[]>>,
	setReviews: React.Dispatch<React.SetStateAction<IReview[]>>,
	setFilters: React.Dispatch<React.SetStateAction<SearchContextState['filters']>>,
	setIsWaitingForSearch: React.Dispatch<React.SetStateAction<boolean>>,
	setWasExternalSearchPerformed: React.Dispatch<React.SetStateAction<boolean>>,
}>(null!);

export const useSearchContext = () => useContext(SearchContext);

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [region, setRegion] = useState<SearchContextState['region']>({
		latitude: BUCHAREST_COORDINATES.latitude,
		longitude: BUCHAREST_COORDINATES.longitude,
		latitudeDelta: DEFAULT_LATITUDE_DELTA,
		longitudeDelta: DEFAULT_LONGITUDE_DELTA,
	});
	const [searchType, setSearchType] = useState<SearchTypeEnum>(SearchTypeEnum.Listings);
	const [listings, setListings] = useState<IListing[]>([]);
	const [reviews, setReviews] = useState<IReview[]>([]);
	const [filteredListings, setFilteredListings] = useState<IListing[]>([]);
	const [filteredReviews, setFilteredReviews] = useState<IReview[]>([]);
	const [filters, setFilters] = useState<SearchContextState['filters']>({
		roomType: PropertyTypeEnum.Any,
		priceRange: { min: MIN_PRICE, max: MAX_PRICE },
		bedrooms: NumberOfBedroomsEnum.Any,
		bathrooms: NumberOfBathroomsEnum.Any,
		amenities: [],
		provider: TypeOfProviderEnum.Any,
	});
	const [isWaitingForSearch, setIsWaitingForSearch] = useState<boolean>(false);
	const [wasExternalSearchPerformed, setWasExternalSearchPerformed] = useState<boolean>(false);
	const { listings: loadedListings, error, isLoading } = useListings();

	useEffect(() => {
		if (!isLoading && !error) {
			setListings(loadedListings);
		}
	}, [loadedListings, isLoading, error]);

	const fetchFilteredData = useCallback(async (newRegion) => {
		try {
			const response = await callApi('search', {
				method: 'POST',
				body: JSON.stringify({
					region: newRegion || region,
					filters
				})
			});
			setListings(response.listings);
			setReviews(response.reviews);
			setFilteredListings(response.filteredListings);
			setFilteredReviews(response.filteredReviews);
		} catch (error) {
			console.error('Failed to fetch filtered data:', error);
		} finally {
			setIsWaitingForSearch(false);
		}
	}, [filters]);

	const triggerSearch = useCallback((newRegion, wasExternal) => {
		setIsWaitingForSearch(true);
		if (newRegion) {
			setRegion(newRegion);
		}
		fetchFilteredData(newRegion).then(() => {
			if (wasExternal) {
				setWasExternalSearchPerformed(true);
			}
		})
	}, [fetchFilteredData]);

	const contextValue = useMemo(() => ({
		triggerSearch,
		state: { region, searchType, listings, reviews, filteredListings, filteredReviews, filters, isWaitingForSearch, wasExternalSearchPerformed },
		setRegion,
		setSearchType,
		setListings,
		setReviews,
		setFilters,
		setIsWaitingForSearch,
		setWasExternalSearchPerformed
	}), [triggerSearch, wasExternalSearchPerformed, isWaitingForSearch, region, searchType, listings, reviews, filteredListings, filteredReviews, filters]);


	return (
		<SearchContext.Provider value={contextValue}>
			{children}
		</SearchContext.Provider>
	);
};
