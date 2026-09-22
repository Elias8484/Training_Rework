Social strength training progression application for iOS and Android.

## Stack

**Frontend**
- React Native 
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
```

Mobile — create `.env` file in the `mobile/` folder:

```dotenv
EXPO_PUBLIC_API_BASE=https://your-api-domain.example.com
```

Then run:

```bash
cd mobile
npm install
npx expo start
```

And run:
```bash
cd backend
dotnet run
```
