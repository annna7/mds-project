export enum UserRoleEnum {
	RegularUser = 'Regular User',
	Landlord = 'Landlord'
}

export function getUserRoleEnumFromString(value: string): UserRoleEnum {
	switch (value) {
	case 'landlord':
		return UserRoleEnum.Landlord;
	}
	return UserRoleEnum.RegularUser;
}
