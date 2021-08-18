import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';



import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { NgxCaptchaModule } from 'ngx-captcha';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    ECommerceModule,
    NgxSliderModule,
    NgxCaptchaModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
