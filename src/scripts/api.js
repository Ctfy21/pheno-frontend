const baseURL = 'http://localhost:8000'

export function getAllPlantsOfExperiment () {

}

export async function getAllExperiments () {
  const response = await fetch(`${baseURL}/experiment`)
  if (response.ok) {
    return await response.json()
  }
}
