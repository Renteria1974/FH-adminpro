import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { EntDesarrollo } from './environments/environment';

if (EntDesarrollo.production)
{
  enableProdMode();
  if (window)
  {
    window.console.log = () => {};
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
