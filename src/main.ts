import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { dashboardAppConfig } from './app.config';

bootstrapApplication(App, dashboardAppConfig)
  .catch((err) => console.error(err));
