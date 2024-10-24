import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OptionPercentageChart = ({ optionPercentages }) => {
  // Prepare data for the chart
  const labels = Object.keys(optionPercentages); // Answer keys (like "6")
  const dataValues = Object.values(optionPercentages).map(value => parseFloat(value)); // Convert percentages to numbers

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Option Percentages',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 40, // Adjust bar thickness if needed
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage (%)',
        },
        ticks: {
          callback: (value) => `${value}%`, // Format y-axis ticks
        },
      },
      x: {
        title: {
          display: true,
          text: 'Answers',
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribution of Answers',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.raw}%`; // Show percentage in tooltip
          },
        },
      },
    },
  };

  return (
    <div className="p-4 rounded-md shadow-md">
      <h3 className="text-lg font-bold mb-2">Option Percentages</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
};
OptionPercentageChart.propTypes = {
  optionPercentages: PropTypes.object.isRequired,
};

export default OptionPercentageChart;
