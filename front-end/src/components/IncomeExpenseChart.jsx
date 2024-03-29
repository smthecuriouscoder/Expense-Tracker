import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart } from 'react-chartjs-2';

Chart.pluginService.register({
  beforeDraw: function(chart) {
    if (chart.config.options.elements.center) {
      // Get ctx from string
      var ctx = chart.chart.ctx;

      // Get options from the center object in options
      var centerConfig = chart.config.options.elements.center;
      var fontStyle = centerConfig.fontStyle || 'Arial';
      var txt = centerConfig.text;
      var color = centerConfig.color || '#000';
      var maxFontSize = centerConfig.maxFontSize || 75;
      var sidePadding = centerConfig.sidePadding || 20;
      var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
      // Start with a base font of 30px
      ctx.font = "30px " + fontStyle;

      // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      var stringWidth = ctx.measureText(txt).width;
      var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      var widthRatio = elementWidth / stringWidth;
      var newFontSize = Math.floor(30 * widthRatio);
      var elementHeight = (chart.innerRadius * 2);

      // Pick a new font size so it will not be larger than the height of label.
      var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
      var minFontSize = centerConfig.minFontSize;
      var lineHeight = centerConfig.lineHeight || 25;
      var wrapText = false;

      if (minFontSize === undefined) {
        minFontSize = 20;
      }

      if (minFontSize && fontSizeToUse < minFontSize) {
        fontSizeToUse = minFontSize;
        wrapText = true;
      }

      // Set font settings to draw it correctly.
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
      ctx.font = fontSizeToUse + "px " + fontStyle;
      ctx.fillStyle = color;

      if (!wrapText) {
        ctx.fillText(txt, centerX, centerY);
        return;
      }

      var words = txt.split(' ');
      var line = '';
      var lines = [];

      // Break words up into multiple lines if necessary
      for (let n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        var testWidth = metrics.width;
        if (testWidth > elementWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }

      // Move the center up depending on line height and number of lines
      centerY -= (lines.length / 2) * lineHeight;

      for (let n = 0; n < lines.length; n++) {
        ctx.fillText(lines[n], centerX, centerY);
        centerY += lineHeight;
      }
      //Draw text in center
      ctx.fillText(line, centerX, centerY);
    }
  }
});

class IncomeExpenseChart extends Component{
  constructor(props) {
    super(props);

    this.state = {
      totalIncome: 0,
      totalExpense: 0
    }
  }

  static getDerivedStateFromProps(props) {    
    return {
      totalIncome: +props.incomeObject,
      totalExpense: +props.expenseObject
    }
  }

  render() {
    const data = {
	    labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Income and Expenses Chart",
          data: [this.state.totalIncome, this.state.totalExpense],
          backgroundColor: ["#63c76a", "#ff4b5a"],
          hoverBackgroundColor: ["#42a349", "#d83e4b"],
          borderColor: ["#000", "#000"],
          borderWidth: [1, 1]
        }
	    ]
    }

    const options = {
	    maintainAspectRatio: false,
      cutoutPercentage: 60,
      tooltips: {
        callbacks: {
            label: function (tooltipItems, data) {
                var label;
                label = data.labels[tooltipItems.index] + ': Rs. ' + data.datasets[0].data[tooltipItems.index];
                return label;
            }
        }
      },
      elements: {
        center: {
          text: 'Balance: Rs. ' + this.props.balance(),
          color: 'brown',
          fontStyle: 'Lato', // Default is Arial
          minFontSize: 19
        }
      }
    }
    
    return (
      <div style={{width: '100%', height: '100%', margin: '0 auto'}}>
        <Doughnut
          data={data}
          options={options}
        />
      </div>
    );
  }
}

export default IncomeExpenseChart;