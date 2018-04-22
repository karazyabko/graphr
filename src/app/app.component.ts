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
      // 'valueField': ['amount', 'amount2', 'amount3']
    };
    this.data = [
      {'title': 'Ukraine', 'amount': '50', 'amount2': '100', 'amount3': '30'},
      {'title': 'Russia', 'amount': '80', 'amount2': '200', 'amount3': '300'},
      {'title': 'Sweden', 'amount': '120', 'amount2': '40', 'amount3': '150'},
      {'title': 'Mexico', 'amount': '250', 'amount2': '60', 'amount3': '200'},
      {'title': 'Canada', 'amount': '150', 'amount2': '180', 'amount3': '110'},
      {'title': 'Brazil', 'amount': '280', 'amount2': '50', 'amount3': '130'},
      {'title': 'Italy', 'amount': '80', 'amount2': '250', 'amount3': '30'},
      {'title': 'China', 'amount': '10', 'amount2': '300', 'amount3': '200'},
      {'title': 'India', 'amount': '50', 'amount2': '100', 'amount3': '230'},
      {'title': 'Australia', 'amount': '160', 'amount2': '130', 'amount3': '60'}
  ];
  /*
  * Test data for detailed stacked bar demo
  * */
    // this.data = [
    //   {
    //     'title': 'Ukraine',
    //     'amount': '50',
    //     'details': [
    //       {'title': 'facebook', 'amount': '30'},
    //       {'title': 'instagram', 'amount': '15'},
    //       {'twitter': 'twitter', 'amount': '5'}
    //     ]
    //   },
    //   {
    //     'title': 'Russia',
    //     'amount': '80',
    //     'details': [
    //       {'title': 'facebook', 'amount': '30'},
    //       {'title': 'instagram', 'amount': '45'},
    //       {'title': 'twitter', 'amount': '5'}
    //     ]
    //   },
    //   {
    //     'title': 'Sweden',
    //     'amount': '120',
    //     'details': [
    //       {'title': 'facebook', 'amount': '40'},
    //       {'title': 'instagram', 'amount': '55'},
    //       {'title': 'twitter', 'amount': '25'}
    //     ]
    //   },
    //   {
    //     'title': 'Mexico',
    //     'amount': '150',
    //     'details': [
    //       {'title': 'facebook', 'amount': '50'},
    //       {'title': 'instagram', 'amount': '15'},
    //       {'title': 'twitter', 'amount': '85'}
    //     ]
    //   }
    // ];
  }
}
