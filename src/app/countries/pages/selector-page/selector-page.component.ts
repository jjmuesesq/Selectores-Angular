import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  }) 

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ){}

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }
  
  onRegionChanged():void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')), //limpiar cuando selector cambia
        tap(() => this.borders = []),
        switchMap( (region) => this.countriesService.getCountriesByRegion(region))
      )
      .subscribe( countries => {
        //console.log('Countries => ', {countries});
        this.countriesByRegion = countries;
      })
  }

  onCountryChanged():void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('')), //limpiar cuando selector cambia - hace efecto secundario
        filter((value: string) => value.length > 0), // esta filtrando el valor
        switchMap( (alphaCode) => this.countriesService.getCountrieByAlphaCode(alphaCode)), // 
        switchMap( (country) => this.countriesService.getCountryBordersByCode(country.borders)) // suscribir a un nuevo observable
      )
      .subscribe( countries => {
        // console.log('Borders => ', {countries});
        this.borders = countries;
      })  
  } 
}
