import axios from "axios"

const baseURL = 'http://localhost:8000'

export async function getAllPlantsOfExperiment (experimentId) {
  try {
    const response = await axios.get(`${baseURL}/experiment/${experimentId}/plant`);
    return response.data;
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
}

export async function getAllExperiments() {
  try {
    const response = await axios.get(`${baseURL}/experiment`);
    return response.data;
  } catch (error) {
    console.error('Error fetching experiments:', error);
    return [];
  }
}

export async function getExperimentById(experimentId) {
  try {
    const response = await axios.get(`${baseURL}/experiment/${experimentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching experiment:', error);
    return null;
  }
}

export async function getTemperatureData(place, startDate, endDate) {
  try {
    const response = await axios.post(`${baseURL}/environment_data/${place}/temperature`, 
    {
        startDate: startDate,
        endDate: endDate
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching temperature data:', error);
    return [];
  }
}

export async function getHumidityData(place, startDate, endDate) {
  try {
    const response = await axios.post(`${baseURL}/environment_data/${place}/humidity`, 
    {
        startDate: startDate,
        endDate: endDate
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching humidity data:', error);
    return [];
  }
}

export async function getIndicatorType(indicatorId) {
  try {
    const response = await axios.get(`${baseURL}/indicator_type/${indicatorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching indicator type:', error);
    return [];
  }
}
