// API service for fetching employee data
const API_BASE_URL = 'https://api.example.com'; // Mock API base URL

// Mock employee data generator for demo purposes
const generateMockEmployeeData = () => {
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jessica', 'William', 'Ashley'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  const employees = [];
  for (let i = 1; i <= 10000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const department = departments[Math.floor(Math.random() * departments.length)];
    
    employees.push({
      id: i,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      city,
      salary: Math.floor(Math.random() * 100000) + 40000, // $40k - $140k
      joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
    });
  }
  
  return employees;
};

export const fetchEmployees = async () => {
  try {
    // In a real app, this would be a real API call:
    // const response = await fetch(`${API_BASE_URL}/employees`);
    // const data = await response.json();
    // return data;
    
    // For demo purposes, return mock data after a short delay
    console.log('Fetching employee data...');
    const mockData = generateMockEmployeeData();
    console.log(`Fetched ${mockData.length} employees`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return mockData;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
};

export const fetchEmployeeById = async (id) => {
  try {
    const employees = await fetchEmployees();
    return employees.find(emp => emp.id === parseInt(id));
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    throw error;
  }
};
