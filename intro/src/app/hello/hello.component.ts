import { Component, OnInit } from '@angular/core';

@Component({
  //the selector put in tags renders that component on the corresponding page
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent implements OnInit {

  //example of interpolation
  // myVariable = "Mehul"

  constructor() { }

  ngOnInit() {
  }

}
