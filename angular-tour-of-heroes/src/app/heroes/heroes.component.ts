import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

// Reserve the constructor for simple initialization such as wiring constructor parameters to properties. The constructor shouldn't do anything. It certainly shouldn't call a function that makes HTTP requests to a remote server as a real data service would.
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  //Got rid of the select on click in the heroes.component.html
  // selectedHero: Hero;

	heroes: Hero[];

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

	//Got rid of the select on click in the heroes.component.html
	// onSelect(hero: Hero): void {
	// 	this.selectedHero = hero;
	// }

	getHeroes(): void {
		this.heroService.getHeroes()
			.subscribe(heroes => this.heroes = heroes);
	}

	// In response to a click event, call the component's click handler and then clear the input field so that it's ready for another name. When the given name is non-blank, the handler creates a Hero-like object from the name (it's only missing the id) and passes it to the services addHero() method.
	//
	// When addHero saves successfully, the subscribe callback receives the new hero and pushes it into to the heroes list for display.
	add(name: string): void {
		name = name.trim();
		if (!name) { return; }
		this.heroService.addHero({ name } as Hero)
			.subscribe(hero => {
				this.heroes.push(hero);
			});
	}
	//Although the component delegates hero deletion to the HeroService, it remains responsible for updating its own list of heroes. The component's delete() method immediately removes the hero-to-delete from that list, anticipating that the HeroService will succeed on the server.
	delete(hero: Hero): void {
		this.heroes = this.heroes.filter(h => h !== hero);
		this.heroService.deleteHero(hero).subscribe();
	}
}


