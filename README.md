Social fitness progression tracking application for iOS and Android.

This started as a fullstack JavaScript web app to log our workouts. Now we are rebuilding it as a real mobile app in React Native, with an ASP.NET Core backend and PostgreSQL database running locally on a Raspberry Pi.

## Stack

**Frontend**
- React Native (Expo)
- TypeScript

**Backend**
- C#
- ASP.NET Core
- PostgreSQL
- JWT authentication

## Status

- Backend deployed and running
- Mobile app in early stage of development
- First features tested on TestFlight

## Running locally

Backend — set secrets via .NET User Secrets:

```bash
cd Backend
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your-postgres-connection-string>"
dotnet user-secrets set "Jwt:Key" "<your-jwt-key>"
dotnet user-secrets set "Jwt:Issuer" "<your-issuer>"
dotnet user-secrets set "Jwt:Audience" "<your-audience>"
dotnet run
```

Mobile — create a `.env` file in the `mobile/` folder:

```dotenv
EXPO_PUBLIC_API_BASE=https://your-api-domain.example.com
```

Then run:

```bash
cd mobile
npm install
npx expo start
```
