"use client";
import React from 'react';
import { Bar } from 'react-chartjs-2';
import bookingsData from '../../components/Datatables/bookings.json'; // Adjust the path to your JSON file
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

// Helper function to get the start of the current week (Sunday) in Sri Lanka's time zone
const getStartOfCurrentWeek = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Get the current day of the week
  const diff = now.getDate() - dayOfWeek; // Calculate the difference to the start of the week
  const startOfWeek = new Date(now.setDate(diff));
  // Adjust for Sri Lanka time zone offset (UTC+5:30)
  startOfWeek.setHours(0, 0, 0, 0);
  return new Date(startOfWeek.getTime() + 5.5 * 60 * 60000);
};

// Helper function to get the end of the current week (Saturday) in Sri Lanka's time zone
const getEndOfCurrentWeek = (startOfWeek: Date): Date => {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return endOfWeek;
};

// Get the start and end of the current week in Sri Lanka's time zone
const startOfWeekSL = getStartOfCurrentWeek();
const endOfWeekSL = getEndOfCurrentWeek(startOfWeekSL);

console.log(`Start of week: ${startOfWeekSL}`);
console.log(`End of week: ${endOfWeekSL}`);

// Initialize an array with 7 elements for each day of the week
const checkIns = new Array(7).fill(0);
const checkOuts = new Array(7).fill(0);

// Helper function to get the day of the week from a date string in Sri Lanka's time zone (UTC+5:30)
const getDayOfWeekSL = (dateString: string): number => {
  const date = new Date(dateString);
  // Adjust for Sri Lanka time zone offset (UTC+5:30)
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  const slDate = new Date(utcDate.getTime() + 5.5 * 60 * 60000);
  return slDate.getDay();
};

// Process bookings data to count check-ins and check-outs within the current week
bookingsData.forEach(booking => {
  const checkInDate = new Date(booking.start);
  const checkOutDate = new Date(booking.end);
  
  if (checkInDate >= startOfWeekSL && checkInDate <= endOfWeekSL) {
    const checkInDay = getDayOfWeekSL(booking.start);
    checkIns[checkInDay]++;
  }
  
  if (checkOutDate >= startOfWeekSL && checkOutDate <= endOfWeekSL) {
    const checkOutDay = getDayOfWeekSL(booking.end);
    checkOuts[checkOutDay]++;
  }
});

const data = {
  labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  datasets: [
    {
      label: 'Check In',
      data: checkIns,
      backgroundColor: 'rgba(96, 165, 250, 1)',
      borderColor: 'rgba(96, 165, 250, 1)',
      borderWidth: 1,
      barThickness: 10, // Set the thickness of the bars
      maxBarThickness: 10, // Set the maximum thickness of the bars
    },
    {
      label: 'Check Out',
      data: checkOuts,
      backgroundColor: 'rgba(209, 0, 0, 1)',
      borderColor: 'rgba(209, 0, 0, 1)',
      borderWidth: 1,
      barThickness: 10, // Set the thickness of the bars
      maxBarThickness: 10, // Set the maximum thickness of the bars
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false, // Allows the canvas to resize based on the container
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        font: {
          size: window.innerWidth < 768 ? 12 : 14, // Adjust the font size for the legend based on the screen width
        }
      }
    },
    title: {
      display: true,
      text: 'Reservation Stats',
      font: {
        size: window.innerWidth < 768 ? 24 : 24, // Adjust the font size based on the screen width
        family: 'sans-serif', // Optionally, set the font family
        weight: 700, // Numeric weight
      },
      color: '#1C2434', 
    },
  },
  animation: {
    duration: 2000, // Animation duration in milliseconds
    easing: 'easeInOutQuad' as const, // Easing function
    onComplete: function () {
      console.log('Animation complete');
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        font: {
          size: window.innerWidth < 768 ? 9 : 12, // Adjust the font size for the x-axis labels based on the screen width
        }
      }
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: window.innerWidth < 768 ? 9 : 12, // Adjust the font size for the y-axis labels based on the screen width
        }
      }
    }
  }
};

const ReservationChart: React.FC = () => {
  return (
    <div className="row-span-8 rounded-md border border-stroke bg-white p-6 shadow-default relative">
      <Bar data={data} options={options} style={{ height: '80%', width: '100%' }} />
    </div>
  );
};

export default ReservationChart;
















