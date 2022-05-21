import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Movies, MovieItem, PopMovies, PopMovieItem, EWMovies, EWMovieItem, Shows, Screening } from './movies';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  movies: EWMovieItem[] = [];
  constructor(private http: HttpClient) {}

  getNumSelected() {
    return this.movies.length;
  }

  getSelectedMovies() {
    return this.movies;
  }
/*  Will need to create a new interface for how we add things to Event.  
      --would this interface be in event.componet.ts or here?
    Adding a particular screening instead of
    all screenings....perhaps: if movieItem not in movies array, we push the EWMovieItem to the movies array, then replace
    Shows[0].shows with the selected screening?  If movieItem is already in array, then push just the chosen screening to
    that movieItem's shows array.
    For removing, essentially the reverse--if MovieItem shows array length is 1, then remove movie item. else remove the
    specified screening id rom that movieItem's shows array.
*/
  addMovieToEvent(ewMovieItem: EWMovieItem) {
    this.movies.push(ewMovieItem);
    console.log(this.movies);
  }

  addScreeningToEvent(movie: EWMovieItem, screening: Screening) {
    let film : EWMovieItem = this.deepCopy<EWMovieItem>(movie);
    let selection: Screening = this.deepCopy<Screening>(screening);

    if (movie) {
      console.log("movie: " + movie.title);
    }

    if (!this.movies.includes(film)) {
        film.shows[0].show = [selection];
        console.log("f", film);
        console.log("m", movie);
        this.movies.push(film);
        //movie.shows.push(screening);
    } else {
      //movie.shows.push(screening);
      film.shows[0].show?.push(selection);
    }
    console.log(this.movies);
  }

  removeScreeningFromEvent(movie: EWMovieItem, screening: Screening) {
    //let film : EWMovieItem = this.deepCopy<EWMovieItem>(movie);
    //let selection: Screening = this.deepCopy<Screening>(screening);
    console.log(movie);
    console.log(screening);
    for (let i = this.movies.length - 1; i >= 0; --i) {
      console.log(typeof this.movies[i].shows[0].show![0].screeningid);
      console.log(typeof screening.screeningid);
      console.log(JSON.stringify(this.movies[i].shows[0].show![0].screeningid) == JSON.stringify(screening.screeningid));
      if (JSON.stringify(this.movies[i].shows[0].show![0].screeningid) == JSON.stringify(screening.screeningid)) {
        this.movies.splice(i,1);
      }
    }
    console.log(this.movies);
  }


  removeMovieFromEvent(ewMovieItem: EWMovieItem) {
    for (let i = this.movies.length - 1; i >= 0; --i) {
      if (this.movies[i] == ewMovieItem) {
        this.movies.splice(i,1);
      }
    }
    console.log(this.movies);
  }

  resetMovieArray() {
    this.movies.length = 0;
    console.log("selected movies cleared");
    return this.movies;
    
  }

  
  deepCopy<T>(instance : T) : T {
    if ( instance == null){
        return instance;
    }

    // handle Dates
    if (instance instanceof Date) {
        return new Date(instance.getTime()) as any;
    }

    // handle Array types
    if (instance instanceof Array){
        var cloneArr = [] as any[];
        (instance as any[]).forEach((value)  => {cloneArr.push(value)});
        // for nested objects
        return cloneArr.map((value: any) => this.deepCopy<any>(value)) as any;
    }
    // handle objects
    if (instance instanceof Object) {
        var copyInstance = { ...(instance as { [key: string]: any }
        ) } as { [key: string]: any };
        for (var attr in instance) {
            if ( (instance as Object).hasOwnProperty(attr)) 
                copyInstance[attr] = this.deepCopy<any>(instance[attr]);
        }
        return copyInstance as T;
    }
    // handling primitive data types
    return instance;
}
}


