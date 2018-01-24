# Graphr

This is an attempt to create "all-in-one" D3.js charts component for Angular 4.

## Setup

- Clone this repository
- `npm install`
- `ng serve` for dev server start
- Navigate to `http://localhost:4200/`

## Description

For the moment component supports 5 types of charts, such as:

- Bar Chart
- Pie Chart
- Histogram
- World Heatmap
- Detailed Stacked Bar
- Line Chart
- Area Chart

There is a default config for all charts, but you can easily overwrite it with new values.

##Charts

### Bar Chart

Default config:

```angular2html
barDefaultOptions = {
          'nameField': '',      //required, legend title field
          'valueField': '',     //required, value field
          'showLegend': true,
          'showAxis': true,
          'animated': true,
          'chart': {
            'width': 420,
            'height': 300,
            'spacing': 20
          },
          'bar': {
            'height': 20,
            'margin': 5
          },
          'legend': {
            'width': 300,
            'spacing': 5
          },
          'barColorScheme': d3.scaleOrdinal(d3.schemeCategory20b)
        };
```

Test data:

```angular2html
this.data = [
      {'title': 'Ukraine', 'amount': '50'},
      {'title': 'Russia', 'amount': '80'},
      {'title': 'Sweden', 'amount': '120'},
      {'title': 'Mexico', 'amount': '250'},
      {'title': 'Canada', 'amount': '150'},
      {'title': 'Brazil', 'amount': '280'},
      {'title': 'Italy', 'amount': '80'},
      {'title': 'China', 'amount': '10'},
      {'title': 'India', 'amount': '50'},
      {'title': 'Australia', 'amount': '160'},
  ];
```

Overwritten fields in config:

```angular2html
this.options = {
      'nameField': 'title',
      'valueField': 'amount'
    };
```

Usage:

```angular2html
<app-graphr id="test1" [data]="data" type="bar" [options]="options"></app-graphr>
```

Result:

![bar](https://i.imgur.com/e5o6IvG.png)

### Pie Chart

Default config:

```angular2html
pieDefaultOptions = {
          'nameField': '',      //required, legend title field
          'valueField': '',     //required, value field
          'showLegend': true,
          'animated': true,
          'chart': {
            'width': 300,
            'height': 300,
            'spacing': 20
          },
          'pie': {
            'radius': 150,
            'arc': {
              'innerRadius': 0,
              'outerRadius': 150
            }
          },
          'legend': {
            'width': 300,
            'rectSize': 20,
            'spacing': 5
          },
          'pieColorScheme': d3.scaleOrdinal(d3.schemeCategory20b)
        };
```

Test data:

```angular2html
this.data = [
      {'title': 'Ukraine', 'amount': '50'},
      {'title': 'Russia', 'amount': '80'},
      {'title': 'Sweden', 'amount': '120'},
      {'title': 'Mexico', 'amount': '250'},
      {'title': 'Canada', 'amount': '150'},
      {'title': 'Brazil', 'amount': '280'},
      {'title': 'Italy', 'amount': '80'},
      {'title': 'China', 'amount': '10'},
      {'title': 'India', 'amount': '50'},
      {'title': 'Australia', 'amount': '160'},
  ];
```

Overwritten fields in config:

```angular2html
this.options = {
      'nameField': 'title',
      'valueField': 'amount'
    };
```

Usage:

```angular2html
<app-graphr id="test1" [data]="data" type="pie" [options]="options"></app-graphr>
```

Result:

![pie](https://i.imgur.com/MPyvjs9.png)

### Histogram Chart

Default config:

```angular2html
histogramDefaultOptions = {
  'valueField': '',       //required, value field
  'animated': true,
  'ticks': 10,
  'chart': {
    'width': 500,
    'height': 300,
    'spacing': 30
  },
  'histogramColorScheme': d3.scaleOrdinal(d3.schemeCategory20b)
};
```

Test data:

```angular2html
this.data = [
      {'title': 'Ukraine', 'amount': '50'},
      {'title': 'Russia', 'amount': '80'},
      {'title': 'Sweden', 'amount': '120'},
      {'title': 'Mexico', 'amount': '250'},
      {'title': 'Canada', 'amount': '150'},
      {'title': 'Brazil', 'amount': '280'},
      {'title': 'Italy', 'amount': '80'},
      {'title': 'China', 'amount': '10'},
      {'title': 'India', 'amount': '50'},
      {'title': 'Australia', 'amount': '160'},
  ];
```

Overwritten fields in config:

```angular2html
this.options = {
      'valueField': 'amount'
    };
```

Usage:

```angular2html
<app-graphr id="test1" [data]="data" type="histogram" [options]="options"></app-graphr>
```

Result:

![histogram](https://i.imgur.com/hx6kega.png)

### World Heatmap

Default config:

```angular2html
worldHeatDefaultOptions = {
  'valueField': '',   //required
  'nameField': '',    //required
  'chart': {
    'width': 800,
    'height': 600,
    'spacing': 30,
    'defaultScale': 75
  },
  'colors': {
    'minValue': '#FF0000',
    'maxValue': '#0000FF'
  },
  'scale': {
    'horizontal': '1.3',
    'vertical': '1'
  }
};
```

Test data:

```angular2html
this.data = [
      {'title': 'Ukraine', 'amount': '50'},
      {'title': 'Russia', 'amount': '80'},
      {'title': 'Sweden', 'amount': '120'},
      {'title': 'Mexico', 'amount': '250'},
      {'title': 'Canada', 'amount': '150'},
      {'title': 'Brazil', 'amount': '280'},
      {'title': 'Italy', 'amount': '80'},
      {'title': 'China', 'amount': '10'},
      {'title': 'India', 'amount': '50'},
      {'title': 'Australia', 'amount': '160'},
  ];
```

Overwritten fields in config:

```angular2html
this.options = {
      'nameField': 'title',
      'valueField': 'amount'
    };
```

Usage:

```angular2html
<app-graphr id="test1" [data]="data" type="world-heat-map" [options]="options"></app-graphr>
```

Result:

![world](https://i.imgur.com/COSjUqz.png)

### Detailed Stacked Bar 

Default config:

```angular2html
detailedStackBarDefaultOptions = {
  'valueField': '',     //required, value field
  'nameField': '',      //required
  'chart': {
    'width': 400,
    'height': 400,
    'spacing': 30
  },
  'detailedStackBarColorScheme': d3.scaleOrdinal(d3.schemeCategory20b)
};
```

Test data:

```angular2html
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
```

Overwritten fields in config:

```angular2html
this.options = {
      'nameField': 'title',
      'valueField': 'amount'
    };
```

Usage:

```angular2html
<app-graphr id="test1" [data]="data" type="detailed-stack-bar" [options]="options"></app-graphr>
```

Result:

![detailed_stack_bar](https://i.imgur.com/G2ZcU7M.png)

### Line chart 

Default config:

```angular2html
lineDefaultOptions = {
          'valueField': [],     //required, value fields array
          'nameField': '',      //required
          'showGrid': true,
          'showDots': true,
          'showLegend': true,
          'smoothLine': false,
          'chart': {
            'width': 800,
            'height': 400,
            'spacing': 30
          },
          'legend': {
            'width': 300,
            'size': 20,
            'spacing': 5
          },
          'lineColorScheme': d3.scaleOrdinal(d3.schemeCategory10)
        };
```

Test data:

```angular2html
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
    ]
```

##### Single line

Overwritten fields in config:

```angular2html
this.options = {
      'nameField': 'title',
      'valueField': ['amount']
    };
```

Usage:

```angular2html
<app-graphr id="test1" [data]="data" type="line" [options]="options"></app-graphr>
```

Result:

![single line](https://i.imgur.com/PekZtpa.png)

##### Multiple lines

Overwritten fields in config:

```angular2html
this.options = {
      'nameField': 'title',
      'valueField': ['amount', 'amount2', 'amount3']
    };
```

Usage:

```angular2html
<app-graphr id="test1" [data]="data" type="line" [options]="options"></app-graphr>
```

Result:

![multiple line](https://i.imgur.com/1s6BxyM.png)

### Area chart 

Default config:

```angular2html
areaDefaultOptions = {
          'valueField': [],     //required, value fields array
          'nameField': '',      //required
          'showGrid': true,
          'showDots': true,
          'showLegend': true,
          'smoothLine': false,
          'chart': {
            'width': 800,
            'height': 400,
            'spacing': 30
          },
          'legend': {
            'width': 300,
            'size': 20,
            'spacing': 5
          },
          'areaColorScheme': d3.scaleOrdinal(d3.schemeCategory10)
        };
```

Test data:

```angular2html
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
    ]
```

##### Single area

Overwritten fields in config:

```angular2html
this.options = {
      'nameField': 'title',
      'valueField': ['amount']
    };
```

Usage:

```angular2html
<app-graphr id="test1" [data]="data" type="area" [options]="options"></app-graphr>
```

Result:

![single area](https://i.imgur.com/U1V5cNi.png)

##### Multiple areas

Overwritten fields in config:

```angular2html
this.options = {
      'nameField': 'title',
      'valueField': ['amount', 'amount2', 'amount3']
    };
```

Usage:

```angular2html
<app-graphr id="test1" [data]="data" type="area" [options]="options"></app-graphr>
```

Result:

![multiple areas](https://i.imgur.com/IWb6XqQ.png)






