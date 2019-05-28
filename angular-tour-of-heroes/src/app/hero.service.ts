// This marks the class as one that participates in the dependency injection system. The HeroService class is going to provide an injectable service, and it can also have its own injected dependencies. The @Injectable() decorator accepts a metadata object for the service, the same way the @Component() decorator did for your component classes.
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './messages.service'

//The heroes web API expects a special header in HTTP save requests. That header is in the httpOptions constant defined here
const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

// Reserve the constructor for simple initialization such as wiring constructor parameters to properties. The constructor shouldn't do anything. It certainly shouldn't call a function that makes HTTP requests to a remote server as a real data service would.
@Injectable({ providedIn: 'root' })
export class HeroService {

	private heroesUrl = 'api/heroes';  // URL to web api

	constructor(
		private http: HttpClient,
		private messageService: MessageService) { }

	/** GET heroes from the server */
	getHeroes (): Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl)
			.pipe(
				tap(_ => this.log('fetched heroes')),
				catchError(this.handleError<Hero[]>('getHeroes', []))
			);
	}

	/** GET hero by id. Return `undefined` when id not found */
	getHeroNo404<Data>(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/?id=${id}`;
		return this.http.get<Hero[]>(url)
			.pipe(
				map(heroes => heroes[0]), // returns a {0|1} element array
				tap(h => {
					const outcome = h ? `fetched` : `did not find`;
					this.log(`${outcome} hero id=${id}`);
				}),
				catchError(this.handleError<Hero>(`getHero id=${id}`))
			);
	}
	//Note the backticks ( ` ) that define a JavaScript template literal for embedding the id.
	// Like getHeroes(), getHero() has an asynchronous signature. It returns a mock hero as an Observable, using the RxJS of() function.
	//
	// You'll be able to re-implement getHero() as a real Http request without having to change the HeroDetailComponent that calls it.
	/** GET hero by id. Will 404 if id not found */
	getHero(id: number): Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
		);
	}

	/* GET heroes whose name contains search term */
	//The method returns immediately with an empty array if there is no search term. The rest of it closely resembles getHeroes(). The only significant difference is the URL, which includes a query string with the search term.
	searchHeroes(term: string): Observable<Hero[]> {
		if (!term.trim()) {
			// if not search term, return empty hero array.
			return of([]);
		}
		return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
			tap(_ => this.log(`found heroes matching "${term}"`)),
			catchError(this.handleError<Hero[]>('searchHeroes', []))
		);
	}

	//////// Save methods //////////
	/** POST: add a new hero to the server */
	//HeroService.addHero() differs from updateHero in two ways.
	//     it calls HttpClient.post() instead of put().
	//     it expects the server to generate an id for the new hero, which it returns in the Observable<Hero> to the caller.
	addHero (hero: Hero): Observable<Hero> {
		return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
			tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
			catchError(this.handleError<Hero>('addHero'))
		);
	}

	/** DELETE: delete the hero from the server */
	//     calls HttpClient.delete.
	//     the URL is the heroes resource URL plus the id of the hero to delete
	//     you don't send data as you did with put and post.
	//     you still send the httpOptions.
	deleteHero (hero: Hero | number): Observable<Hero> {
		const id = typeof hero === 'number' ? hero : hero.id;
		const url = `${this.heroesUrl}/${id}`;

		return this.http.delete<Hero>(url, httpOptions).pipe(
			tap(_ => this.log(`deleted hero id=${id}`)),
			catchError(this.handleError<Hero>('deleteHero'))
		);
	}

	/** PUT: update the hero on the server */
	updateHero (hero: Hero): Observable<any> {
		return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
			tap(_ => this.log(`updated hero id=${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
		);
	}

	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	private handleError<T> (operation = 'operation', result?: T) {
		return (error: any): Observable<T> => {

			// TODO: send the error to remote logging infrastructure
			console.error(error); // log to console instead

			// TODO: better job of transforming error for user consumption
			this.log(`${operation} failed: ${error.message}`);

			// Let the app keep running by returning an empty result.
			return of(result as T);
		};
	}

	/** Log a HeroService message with the MessageService */
	private log(message: string) {
		this.messageService.add(`HeroService: ${message}`);
	}
}