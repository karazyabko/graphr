import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any[];
  options: any;

  constructor() {
    this.options = {
      'nameField': 'title',
      'valueField': 'amount'
    };
  //   this.data = [
  //     {'title': 'Ukraine', 'amount': '50'},
  //     {'title': 'Russia', 'amount': '80'},
  //     {'title': 'Sweden', 'amount': '120'},
  //     {'title': 'Mexico', 'amount': '250'},
  //     {'title': 'Canada', 'amount': '150'},
  //     {'title': 'Brazil', 'amount': '280'},
  //     {'title': 'Italy', 'amount': '80'},
  //     {'title': 'China', 'amount': '10'},
  //     {'title': 'India', 'amount': '50'},
  //     {'title': 'Australia', 'amount': '160'},
  // ];
  /*
  * Test data for detailed stacked bar demo
  * */
    this.data = [
      {
        'title': 'Ukraine',
        'amount': '50',
        'details': [
          {'title': 'facebook', 'amount': '30'},
          {'title': 'instagram', 'amount': '15'},
          {'twitter': 'twitter', 'amount': '5'}
        ]
      },
      {
        'title': 'Russia',
        'amount': '80',
        'details': [
          {'title': 'facebook', 'amount': '30'},
          {'title': 'instagram', 'amount': '45'},
          {'title': 'twitter', 'amount': '5'}
        ]
      },
      {
        'title': 'Sweden',
        'amount': '120',
        'details': [
          {'title': 'facebook', 'amount': '40'},
          {'title': 'instagram', 'amount': '55'},
          {'title': 'twitter', 'amount': '25'}
        ]
      },
      {
        'title': 'Mexico',
        'amount': '150',
        'details': [
          {'title': 'facebook', 'amount': '50'},
          {'title': 'instagram', 'amount': '15'},
          {'title': 'twitter', 'amount': '85'}
        ]
      }
    ];
  }
}
