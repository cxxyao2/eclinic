# Eclinic

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 18.2.0.

## Running Unit Tests

Execute `npm run test` to run unit tests via Jest.
Tested:

- Login component
- Authorizaiton component
- Auth guard

## Running End-to-End Tests

Run `npx cypress open` to perform end-to-end tests using Cypress.

## Supporting Multiple Backends

Set the appropriate `BaseURL` value in `env.js`.

```javascript
window.__env.BaseURL = "http://localhost:5215";
```

The backend code for this project is located at:[Here](https://github.com/cxxyao2/HealthCenterBackend.git).

## Sharing Models between Frontend and Backend

Share services and models through `openapicli` tools. This significantly reduces conflicts and errors. Execute the `generate-client-sdk` command in `package.json`:

```bash
"generate-client-sdk": "openapi-generator-cli generate -i http://localhost:5215/swagger/v1/swagger.json -g typescript-angular -o src/libs/api-client --skip-validate-spec --type-mappings DateTime=Date,object=any"
```

Then , importing the elements from `src/libs/api-clients' like this:

```
import { AuthService } from '@libs/api-client';
```

## Internationalization (i18n)

Use the `@jsverse/transloco` package for a simple and elegant approach to implement internationalization.

In component.ts file,

```
import {translocoDirective} from '...'
...
@Component({
    imports:[{...,translocoDirective,...}]
)}
```

In template file, wrap the content with transloco directive

```
<div *transloco="let t">
       <div>{t('your-translate-key')}
</div>
```

## Notifications

Use Server-Side Events to receive notifications from the backend.

## Authorization and Authentication

Role-based authorization. Only administrators can create schedules for practitioners. Authentication is based on JWT using an access token and a refresh token.

## Screenshots of Main Features

- Screenshot 1
- Screenshot 2
