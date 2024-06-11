# Onboarding (Linux)
1. Install ``Docker Desktop``,  `zerotier-cli`, and `nvm`
2. Install `node 20` via `nvm`
3. Run `zerotier-cli join <LAN>` and check joining was successful via `zerotier-cli listnetworks`
4. Ensure `API_HOST` in `.env` from `frontend` is the device's IP on the zero-tier LAN (use `ifconfig`)
5. Create `.env` files in `frontend` and `backend`
6. Run `npm install` in root, `frontend` and `backend` directories
7. Run `docker compose up` in root for the database container
8. Test `backend` is set up correctly by running `npm run dev` in the `backend` directory
9. Test `frontend` is set up correctly by running `npm run start` in the `frontend` directory (scan QR on Expo phone app)
10. If the `backend` and `frontend` are not linked correctly, the app will crash. Try to:
     * change the `start` script in frontend to `expo start -c` (remove cache)
     * reinstall `node_modules` in all 3 places
# Steps for running the project
1. Ensure `Docker Desktop` is running, and so is the container with the database.
2. Start the backend with `npm run dev` and ensure seeding & connection don't fail (otherwise try again)
3. Connect your phone and your PC (check with the `listnetworks` command) to the same `zero-tier` LAN
4. Start the frontend with `npm run start` and ensure backend & frontend are connected
