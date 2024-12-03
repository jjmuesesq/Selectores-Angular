import { Injectable } from '@angular/core';
import { Region, SmallCountry, Country, Name } from '../interfaces/country.interfaces';
import { Observable, of, tap, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class CountriesService{

    private baseUrl: string = 'https://restcountries.com/v3.1';
    //'https://restcountries.com/v3.1/region/americas?fields=cca3,name,borders';

    private _regions: Region[] = [ Region.Africa, Region.Americas, Region.Asia, Region.Europe, Region.Oceania ];

    constructor(
        private http: HttpClient
    ){}

    get regions(): Region[]{
        return [ ...this._regions ];
    }

    getCountriesByRegion( region: Region): Observable<SmallCountry[]>{
        if(!region) return of([]);
        const url: string = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;
        return this.http.get<Country[]>(url)
        .pipe(
            map(countries => countries.map( country => ({
                name: country.name.common,
                cca3: country.cca3,
                borders: country.borders ?? [] //operador de coharencia nula
            }))),
            //tap(response => console.log('response =>', { response })),
        );
    }
}