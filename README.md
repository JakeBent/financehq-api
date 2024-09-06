## Prerequesites

* Docker is installed

## Installation

* Clone the directory and cd into it.
* `docker-compose up`
* `npm run db:push` in a separate terminal once application is running

## Authentication

This app uses a simple JWT set up. You can obtain a token through the sign up or log in methods.

To make an authenticated request, set your request's `x-auth-token` header to `Bearer <your-access-token>`

## Considerations/Compromises

* Enum for categories instead of separate model with 1-n relationship
* Ran out of time for tests or integration with deployment tool