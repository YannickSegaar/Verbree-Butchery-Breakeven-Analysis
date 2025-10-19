import React, { useState, useMemo, CSSProperties } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Scatter, ScatterChart, ZAxis } from 'recharts';

interface Product {
  id: string;
  name: string;
  category: 'Classic' | 'Pitmaster';
  meatType: 'Beef' | 'Pork' | 'Poultry';
  weight: number;
  costPrice: number;
  wastePercentage: number;
  prepTimeMinutes: number;
  sellPrice: number;
  margin: number;
  units: number;
}

interface StartupCost {
  id: string;
  category: string;
  item: string;
  estimatedCost: number;
  actualCost: number;
  paid: boolean;
  notes: string;
}

interface MonthlyCost {
  id: string;
  category: string;
  item: string;
  monthlyCost: number;
  annualCost: number;
  type: string;
  notes: string;
}

const styles = {
  container: {
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  } as CSSProperties,
  header: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    padding: '24px'
  } as CSSProperties,
  headerContent: {
    maxWidth: '1400px',
    margin: '0 auto'
  } as CSSProperties,
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2F3E46',
    margin: 0
  } as CSSProperties,
  subtitle: {
    color: '#282828',
    marginTop: '8px',
    fontSize: '16px'
  } as CSSProperties,
  tabsContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px'
  } as CSSProperties,
  tabsWrapper: {
    display: 'flex',
    gap: '4px',
    marginTop: '24px',
    borderBottom: '1px solid #e5e5e5'
  } as CSSProperties,
  tab: {
    padding: '12px 24px',
    fontWeight: '500',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: '#282828',
    borderRadius: '8px 8px 0 0',
    transition: 'all 0.2s'
  } as CSSProperties,
  tabActive: {
    backgroundColor: '#fff',
    color: '#587C74',
    borderBottom: '2px solid #587C74'
  } as CSSProperties,
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '24px'
  } as CSSProperties,
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  } as CSSProperties,
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '20px'
  } as CSSProperties,
  metricLabel: {
    fontSize: '14px',
    color: '#282828',
    marginBottom: '8px'
  } as CSSProperties,
  metricValue: {
    fontSize: '28px',
    fontWeight: 'bold'
  } as CSSProperties,
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    padding: '24px',
    marginBottom: '24px'
  } as CSSProperties,
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  } as CSSProperties,
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#2F3E46',
    margin: 0
  } as CSSProperties,
  button: {
    backgroundColor: '#587C74',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  } as CSSProperties,
  buttonHover: {
    backgroundColor: '#4a6b64'
  } as CSSProperties,
  filterButton: {
    padding: '8px 16px',
    border: '1px solid #d4d4d4',
    borderRadius: '6px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  } as CSSProperties,
  filterButtonActive: {
    backgroundColor: '#587C74',
    color: '#fff',
    borderColor: '#587C74'
  } as CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  } as CSSProperties,
  tableHeader: {
    backgroundColor: '#f5f5f5',
    textAlign: 'left' as const,
    padding: '12px',
    fontWeight: '600',
    color: '#2F3E46'
  } as CSSProperties,
  tableCell: {
    padding: '12px',
    borderBottom: '1px solid #e5e5e5',
    position: 'relative' as const
  } as CSSProperties,
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #d4d4d4',
    borderRadius: '4px',
    fontSize: '14px'
  } as CSSProperties,
  inputSmall: {
    width: '80px',
    padding: '8px',
    border: '1px solid #d4d4d4',
    borderRadius: '4px',
    fontSize: '14px',
    textAlign: 'right' as const
  } as CSSProperties,
  select: {
    width: '100%',
    padding: '8px',
    border: '1px solid #d4d4d4',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#fff',
    minWidth: '120px'
  } as CSSProperties,
  deleteButton: {
    color: '#BB463C',
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    fontWeight: 'bold'
  } as CSSProperties,
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: '600',
    display: 'inline-block',
    marginLeft: '8px'
  } as CSSProperties,
  progressBar: {
    width: '100%',
    height: '24px',
    backgroundColor: '#e5e5e5',
    borderRadius: '12px',
    overflow: 'hidden',
    marginTop: '8px'
  } as CSSProperties,
  infoBox: {
    padding: '16px',
    borderRadius: '8px',
    marginTop: '16px'
  } as CSSProperties,
  gridTwo: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    marginTop: '24px'
  } as CSSProperties,
  tooltip: {
    position: 'absolute' as const,
    backgroundColor: '#2F3E46',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap' as const,
    zIndex: 1000,
    pointerEvents: 'none' as const,
    top: '-35px',
    left: '50%',
    transform: 'translateX(-50%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
  } as CSSProperties,
  sectionDivider: {
    borderTop: '2px solid #587C74',
    margin: '32px 0',
    paddingTop: '24px'
  } as CSSProperties,
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    marginRight: '8px'
  } as CSSProperties
};

const COLORS = {
  classic: '#2F3E46',
  pitmaster: '#587C74',
  beef: '#BB463C',
  pork: '#E07A5F',
  poultry: '#F2CC8F'
};

const BreakEvenAnalysis = () => {
  const [activeTab, setActiveTab] = useState<'breakeven' | 'startup' | 'monthly'>('breakeven');
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Classic' | 'Pitmaster'>('all');
  const [hoursPerDay, setHoursPerDay] = useState<number>(5);
  const [daysPerMonth, setDaysPerMonth] = useState<number>(18);

  // Chart visibility toggles
  const [showMargin, setShowMargin] = useState(true);
  const [showThroughput, setShowThroughput] = useState(false);
  const [showHourlyPotential, setShowHourlyPotential] = useState(false);
  const [showMonthlySalesPotential, setShowMonthlySalesPotential] = useState(false);

  // Seasonality multipliers (percentage of baseline sales)
  const [seasonalityMultipliers, setSeasonalityMultipliers] = useState({
    jan: 70,
    feb: 70,
    mar: 85,
    apr: 100,
    may: 120,
    jun: 140,
    jul: 150,
    aug: 145,
    sep: 120,
    oct: 100,
    nov: 80,
    dec: 90
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'IERS Classic Burger',
      category: 'Classic',
      meatType: 'Beef',
      weight: 3.2,
      costPrice: 15.45,
      wastePercentage: 10,
      prepTimeMinutes: 10,
      sellPrice: 10,
      margin: -7.00,
      units: 80
    },
    {
      id: '2',
      name: 'IERS Pitmaster Brisket',
      category: 'Pitmaster',
      meatType: 'Beef',
      weight: 1,
      costPrice: 18.79,
      wastePercentage: 10,
      prepTimeMinutes: 12,
      sellPrice: 100,
      margin: 79.33,
      units: 10
    },
    {
      id: '3',
      name: 'IERS Pitmaster Ribs',
      category: 'Pitmaster',
      meatType: 'Pork',
      weight: 6,
      costPrice: 13.8,
      wastePercentage: 10,
      prepTimeMinutes: 15,
      sellPrice: 100,
      margin: 84.82,
      units: 10
    },
    {
      id: '4',
      name: 'IERS Pitmaster Steak',
      category: 'Pitmaster',
      meatType: 'Beef',
      weight: 2.5,
      costPrice: 15.55,
      wastePercentage: 10,
      prepTimeMinutes: 10,
      sellPrice: 100,
      margin: 82.89,
      units: 10
    },
    {
      id: '5',
      name: 'IERS Pitmaster Lamb',
      category: 'Pitmaster',
      meatType: 'Beef',
      weight: 2.5,
      costPrice: 41,
      wastePercentage: 10,
      prepTimeMinutes: 18,
      sellPrice: 100,
      margin: 54.90,
      units: 10
    },
    {
      id: '6',
      name: 'IERS Pitmaster Pulled Pork',
      category: 'Pitmaster',
      meatType: 'Pork',
      weight: 3.7,
      costPrice: 29.7,
      wastePercentage: 10,
      prepTimeMinutes: 20,
      sellPrice: 100,
      margin: 67.33,
      units: 10
    }
  ]);

  const [startupCosts, setStartupCosts] = useState<StartupCost[]>([
    { id: '1', category: 'Equipment', item: 'Commercial Smokers (2x)', estimatedCost: 15000, actualCost: 15000, paid: true, notes: 'Offset & Pellet' },
    { id: '2', category: 'Equipment', item: 'Display Cases', estimatedCost: 8000, actualCost: 8000, paid: false, notes: 'Refrigerated' },
    { id: '3', category: 'Equipment', item: 'Prep Tables & Workstations', estimatedCost: 3000, actualCost: 3000, paid: false, notes: 'Stainless steel' },
    { id: '4', category: 'Equipment', item: 'Point of Sale System', estimatedCost: 2500, actualCost: 2500, paid: false, notes: 'Hardware + software' },
    { id: '5', category: 'Renovation', item: 'Kitchen Build-Out', estimatedCost: 25000, actualCost: 25000, paid: false, notes: 'Plumbing, electrical, ventilation' },
    { id: '6', category: 'Renovation', item: 'Interior Design', estimatedCost: 8000, actualCost: 8000, paid: false, notes: 'Fixtures, lighting, seating' },
    { id: '7', category: 'Legal & Admin', item: 'Business Registration', estimatedCost: 1500, actualCost: 1500, paid: false, notes: 'Permits, licenses' },
    { id: '8', category: 'Legal & Admin', item: 'Insurance (First Year)', estimatedCost: 3600, actualCost: 3600, paid: false, notes: 'Liability, property' },
    { id: '9', category: 'Marketing', item: 'Branding & Signage', estimatedCost: 4000, actualCost: 4000, paid: false, notes: 'Logo, exterior sign, menus' },
    { id: '10', category: 'Marketing', item: 'Launch Campaign', estimatedCost: 3000, actualCost: 3000, paid: false, notes: 'Social media, flyers, opening event' },
    { id: '11', category: 'Working Capital', item: 'Initial Inventory', estimatedCost: 8000, actualCost: 8000, paid: false, notes: 'First month meat stock' },
    { id: '12', category: 'Working Capital', item: 'Cash Reserve', estimatedCost: 14040, actualCost: 14040, paid: false, notes: '2 months fixed costs buffer' },
    { id: '13', category: 'Working Capital', item: 'Emergency Fund', estimatedCost: 5000, actualCost: 5000, paid: false, notes: 'Unexpected expenses' }
  ]);

  const [monthlyCosts, setMonthlyCosts] = useState<MonthlyCost[]>([
    { id: '1', category: 'Rent & Utilities', item: 'Rent', monthlyCost: 3500, annualCost: 42000, type: 'Fixed', notes: 'Prime location' },
    { id: '2', category: 'Rent & Utilities', item: 'Utilities', monthlyCost: 800, annualCost: 9600, type: 'Fixed', notes: 'Electric, gas, water' },
    { id: '3', category: 'Labor', item: 'Head Pitmaster', monthlyCost: 3500, annualCost: 42000, type: 'Fixed', notes: 'Full-time' },
    { id: '4', category: 'Labor', item: 'Assistant Chef', monthlyCost: 2500, annualCost: 30000, type: 'Fixed', notes: 'Full-time' },
    { id: '5', category: 'Labor', item: 'Counter Staff (2x)', monthlyCost: 3600, annualCost: 43200, type: 'Fixed', notes: 'Part-time' },
    { id: '6', category: 'Marketing', item: 'Social Media & Ads', monthlyCost: 500, annualCost: 6000, type: 'Variable', notes: 'Monthly campaigns' },
    { id: '7', category: 'Operations', item: 'Insurance', monthlyCost: 300, annualCost: 3600, type: 'Fixed', notes: 'Monthly premium' },
    { id: '8', category: 'Operations', item: 'Accounting & Legal', monthlyCost: 200, annualCost: 2400, type: 'Fixed', notes: 'Bookkeeping services' },
    { id: '9', category: 'Operations', item: 'Point of Sale Software', monthlyCost: 140, annualCost: 1680, type: 'Fixed', notes: 'Monthly subscription' },
    { id: '10', category: 'Supplies', item: 'Packaging Supplies', monthlyCost: 400, annualCost: 4800, type: 'Variable', notes: 'Boxes, wrapping, bags' },
    { id: '11', category: 'Supplies', item: 'Cleaning Supplies', monthlyCost: 100, annualCost: 1200, type: 'Variable', notes: 'Sanitizers, paper products' },
    { id: '12', category: 'Operations', item: 'Maintenance & Repairs', monthlyCost: 500, annualCost: 6000, type: 'Variable', notes: 'Equipment upkeep' }
  ]);

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: 'New Product',
      category: 'Classic',
      meatType: 'Beef',
      weight: 0,
      costPrice: 0,
      wastePercentage: 10,
      prepTimeMinutes: 0,
      sellPrice: 0,
      margin: 0,
      units: 0
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(products.map(p => {
      if (p.id !== id) return p;
      
      const updated = { ...p, [field]: value };
      
      if (field === 'costPrice' || field === 'wastePercentage' || field === 'weight' || field === 'sellPrice' || field === 'units') {
        const trueCost = updated.costPrice / (1 - updated.wastePercentage / 100);
        const totalCost = (trueCost * updated.weight);
        updated.margin = updated.sellPrice - totalCost;
      }
      
      return updated;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addStartupCost = () => {
    const newCost: StartupCost = {
      id: Date.now().toString(),
      category: 'Other',
      item: 'New Item',
      estimatedCost: 0,
      actualCost: 0,
      paid: false,
      notes: ''
    };
    setStartupCosts([...startupCosts, newCost]);
  };

  const updateStartupCost = (id: string, field: keyof StartupCost, value: any) => {
    setStartupCosts(startupCosts.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const deleteStartupCost = (id: string) => {
    setStartupCosts(startupCosts.filter(c => c.id !== id));
  };

  const addMonthlyCost = () => {
    const newCost: MonthlyCost = {
      id: Date.now().toString(),
      category: 'Other',
      item: 'New Cost',
      monthlyCost: 0,
      annualCost: 0,
      type: 'Fixed',
      notes: ''
    };
    setMonthlyCosts([...monthlyCosts, newCost]);
  };

  const updateMonthlyCost = (id: string, field: keyof MonthlyCost, value: any) => {
    setMonthlyCosts(monthlyCosts.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, [field]: value };
      if (field === 'monthlyCost') {
        updated.annualCost = value * 12;
      }
      return updated;
    }));
  };

  const deleteMonthlyCost = (id: string) => {
    setMonthlyCosts(monthlyCosts.filter(c => c.id !== id));
  };

  const calculations = useMemo(() => {
    const totalRevenue = products.reduce((sum, p) => sum + (p.sellPrice * p.units), 0);
    const totalCost = products.reduce((sum, p) => {
      const trueCost = p.costPrice / (1 - p.wastePercentage / 100);
      return sum + (trueCost * p.weight * p.units);
    }, 0);
    const totalMargin = totalRevenue - totalCost;
    const totalUnits = products.reduce((sum, p) => sum + p.units, 0);
    const totalKees = products.reduce((sum, p) => sum + (p.units * (p.units / totalUnits)), 0);
    const totalPrepTime = products.reduce((sum, p) => sum + (p.prepTimeMinutes * p.units), 0);

    // Classic vs Pitmaster breakdown
    const classicProducts = products.filter(p => p.category === 'Classic');
    const pitmasterProducts = products.filter(p => p.category === 'Pitmaster');

    const classicRevenue = classicProducts.reduce((sum, p) => sum + (p.sellPrice * p.units), 0);
    const pitmasterRevenue = pitmasterProducts.reduce((sum, p) => sum + (p.sellPrice * p.units), 0);

    const classicCost = classicProducts.reduce((sum, p) => {
      const trueCost = p.costPrice / (1 - p.wastePercentage / 100);
      return sum + (trueCost * p.weight * p.units);
    }, 0);
    const pitmasterCost = pitmasterProducts.reduce((sum, p) => {
      const trueCost = p.costPrice / (1 - p.wastePercentage / 100);
      return sum + (trueCost * p.weight * p.units);
    }, 0);

    const classicMargin = classicRevenue - classicCost;
    const pitmasterMargin = pitmasterRevenue - pitmasterCost;

    const classicUnits = classicProducts.reduce((sum, p) => sum + p.units, 0);
    const pitmasterUnits = pitmasterProducts.reduce((sum, p) => sum + p.units, 0);

    const classicPrepTime = classicProducts.reduce((sum, p) => sum + (p.prepTimeMinutes * p.units), 0);
    const pitmasterPrepTime = pitmasterProducts.reduce((sum, p) => sum + (p.prepTimeMinutes * p.units), 0);

    const avgMarginPerUnit = totalUnits > 0 ? totalMargin / totalUnits : 0;
    const classicAvgMargin = classicUnits > 0 ? classicMargin / classicUnits : 0;
    const pitmasterAvgMargin = pitmasterUnits > 0 ? pitmasterMargin / pitmasterUnits : 0;

    return {
      totalRevenue,
      totalCost,
      totalMargin,
      totalUnits,
      totalKees,
      totalPrepTime,
      avgMarginPerUnit,
      classicRevenue,
      pitmasterRevenue,
      classicCost,
      pitmasterCost,
      classicMargin,
      pitmasterMargin,
      classicUnits,
      pitmasterUnits,
      classicPrepTime,
      pitmasterPrepTime,
      classicAvgMargin,
      pitmasterAvgMargin
    };
  }, [products]);

  const totalMonthlyOpex = monthlyCosts.reduce((sum, c) => sum + c.monthlyCost, 0);
  const totalStartupCost = startupCosts.reduce((sum, c) => sum + c.actualCost, 0);
  const totalPaid = startupCosts.filter(c => c.paid).reduce((sum, c) => sum + c.actualCost, 0);

  // Calculate total operating expenses (Opex + COGS)
  const totalOperatingExpenses = totalMonthlyOpex + calculations.totalCost;
  const netProfit = calculations.totalRevenue - totalOperatingExpenses;

  const breakEvenUnits = totalMonthlyOpex > 0 && calculations.avgMarginPerUnit > 0
    ? Math.ceil(totalMonthlyOpex / calculations.avgMarginPerUnit)
    : 0;

  // Labor capacity calculations
  const availableMinutesPerMonth = hoursPerDay * 60 * daysPerMonth;
  const usedMinutes = calculations.totalPrepTime;
  const remainingMinutes = availableMinutesPerMonth - usedMinutes;
  const utilizationPercentage = availableMinutesPerMonth > 0 ? (usedMinutes / availableMinutesPerMonth) * 100 : 0;

  // Startup cost recovery
  const monthsToRecoverStartup = netProfit > 0 ? totalStartupCost / netProfit : 0;

  // Seasonality calculations
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthKeys: (keyof typeof seasonalityMultipliers)[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  const seasonalData = monthKeys.map((key, index) => {
    const multiplier = seasonalityMultipliers[key] / 100;
    const monthlyRevenue = calculations.totalRevenue * multiplier;
    const monthlyCost = calculations.totalCost * multiplier;
    const monthlyMargin = monthlyRevenue - monthlyCost;
    const monthlyNetProfit = monthlyMargin - totalMonthlyOpex;
    
    return {
      month: monthNames[index],
      multiplier: seasonalityMultipliers[key],
      revenue: monthlyRevenue,
      cost: monthlyCost,
      margin: monthlyMargin,
      opex: totalMonthlyOpex,
      netProfit: monthlyNetProfit,
      utilization: utilizationPercentage * multiplier
    };
  });

  const annualRevenue = seasonalData.reduce((sum, m) => sum + m.revenue, 0);
  const annualCost = seasonalData.reduce((sum, m) => sum + m.cost, 0);
  const annualMargin = seasonalData.reduce((sum, m) => sum + m.margin, 0);
  const annualOpex = totalMonthlyOpex * 12;
  const annualNetProfit = annualMargin - annualOpex;
  const avgMonthlyNetProfit = annualNetProfit / 12;

  const bestMonth = seasonalData.reduce((best, current) => 
    current.netProfit > best.netProfit ? current : best
  );
  const worstMonth = seasonalData.reduce((worst, current) => 
    current.netProfit < worst.netProfit ? current : worst
  );

  // 24-month projection data with seasonality
  const projectionData: Array<{month: number; cumulativeProfit: number; breakEven: number}> = [];
  let cumulativeProfit = 0;
  
  for (let i = 0; i < 25; i++) {
    const monthIndex = i % 12;
    const yearMultiplier = i < 12 ? 0.8 : 1; // Year 1: 80% ramp-up, Year 2: 100%
    const seasonalProfit = seasonalData[monthIndex].netProfit * yearMultiplier;
    
    if (i > 0) {
      cumulativeProfit += seasonalProfit;
    }
    
    projectionData.push({
      month: i,
      cumulativeProfit,
      breakEven: 0
    });
  }

  // Filter products based on category filter
  const filteredProducts = products.filter(p => 
    categoryFilter === 'all' ? true : p.category === categoryFilter
  );

  // Product efficiency ranking with throughput analysis
  const productEfficiency = products.map(p => {
    const euroPerMinute = p.prepTimeMinutes > 0 ? p.margin / p.prepTimeMinutes : 0;
    const unitsPerHour = p.prepTimeMinutes > 0 ? 60 / p.prepTimeMinutes : 0;
    const euroPerHour = euroPerMinute * 60;
    const maxMonthlySales = p.prepTimeMinutes > 0 ? Math.floor(availableMinutesPerMonth / p.prepTimeMinutes) : 0;
    const monthlyRevenuePotential = maxMonthlySales * p.margin;
    
    return {
      name: p.name,
      category: p.category,
      margin: p.margin,
      euroPerMinute,
      euroPerHour,
      unitsPerHour,
      prepTime: p.prepTimeMinutes,
      currentUnits: p.units,
      maxMonthlySales,
      monthlyRevenuePotential,
      totalMarginContribution: p.margin * p.units
    };
  }).sort((a, b) => b.euroPerMinute - a.euroPerMinute);

  // Top products by total margin contribution
  const topProductsByMargin = [...productEfficiency]
    .sort((a, b) => b.totalMarginContribution - a.totalMarginContribution)
    .slice(0, 10);

  // Dynamic comparison chart data
  const comparisonChartData = products.map(p => {
    const euroPerMinute = p.prepTimeMinutes > 0 ? p.margin / p.prepTimeMinutes : 0;
    const euroPerHour = euroPerMinute * 60;
    const unitsPerHour = p.prepTimeMinutes > 0 ? 60 / p.prepTimeMinutes : 0;
    const hourlyRevenuePotential = unitsPerHour * p.margin;
    const monthlySalesPotential = hourlyRevenuePotential * hoursPerDay * daysPerMonth;

    return {
      name: p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name,
      fullName: p.name,
      category: p.category,
      margin: p.margin,
      unitsPerHour: parseFloat(unitsPerHour.toFixed(2)),
      hourlyPotential: parseFloat(hourlyRevenuePotential.toFixed(2)),
      monthlySalesPotential: parseFloat(monthlySalesPotential.toFixed(2)),
      currentUnits: p.units
    };
  }).sort((a, b) => b.hourlyPotential - a.hourlyPotential);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Verbree Butchery - Business Analysis</h1>
          <p style={styles.subtitle}>Break-even analysis and financial planning dashboard</p>
        </div>
      </div>

      <div style={styles.tabsContainer}>
        <div style={styles.tabsWrapper}>
          <button
            onClick={() => setActiveTab('breakeven')}
            style={{
              ...styles.tab,
              ...(activeTab === 'breakeven' ? styles.tabActive : {})
            }}
          >
            Break-Even Analysis
          </button>
          <button
            onClick={() => setActiveTab('startup')}
            style={{
              ...styles.tab,
              ...(activeTab === 'startup' ? styles.tabActive : {})
            }}
          >
            Startup Costs
          </button>
          <button
            onClick={() => setActiveTab('monthly')}
            style={{
              ...styles.tab,
              ...(activeTab === 'monthly' ? styles.tabActive : {})
            }}
          >
            Monthly Operating Costs
          </button>
        </div>
      </div>

      <div style={styles.content}>
        {activeTab === 'breakeven' && (
          <>
            {/* Key Performance Metrics */}
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <div style={styles.metricLabel}>Monthly Revenue</div>
                <div style={{...styles.metricValue, color: '#587C74'}}>
                  €{calculations.totalRevenue.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.metricLabel}>Monthly Gross Margin</div>
                <div style={{...styles.metricValue, color: '#587C74'}}>
                  €{calculations.totalMargin.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>
                  (includes waste/packaging)
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.metricLabel}>Operating Expenses</div>
                <div style={{...styles.metricValue, color: '#BB463C'}}>
                  €{totalOperatingExpenses.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </div>
              </div>
              <div style={styles.metricCard}>
                <div style={styles.metricLabel}>Monthly Net Profit</div>
                <div style={{...styles.metricValue, color: netProfit >= 0 ? '#587C74' : '#BB463C'}}>
                  €{netProfit.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </div>
              </div>
            </div>

            {/* Break-Even Status */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Break-Even Status</h2>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px', marginBottom: '16px'}}>
                <span style={{fontSize: '16px', fontWeight: '500'}}>Monthly Break-Even Point:</span>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: netProfit >= 0 ? '#e8f4f1' : '#ffe5e5',
                  color: netProfit >= 0 ? '#587C74' : '#BB463C',
                  fontSize: '16px'
                }}>
                  {netProfit >= 0 ? '✓ PROFITABLE' : '✗ UNPROFITABLE'}
                </span>
              </div>
              
              <div style={{fontSize: '16px', color: '#282828', marginBottom: '16px'}}>
                Current margin covers <strong>{((calculations.totalMargin / totalMonthlyOpex) * 100).toFixed(1)}%</strong> of operating expenses
              </div>

              {/* Progress bar */}
              <div style={{marginBottom: '16px'}}>
                <div style={{fontSize: '14px', marginBottom: '8px', color: '#666'}}>
                  Margin vs Operating Expenses
                </div>
                <div style={styles.progressBar}>
                  <div style={{
                    width: `${Math.min((calculations.totalMargin / totalMonthlyOpex) * 100, 100)}%`,
                    height: '100%',
                    backgroundColor: calculations.totalMargin >= totalMonthlyOpex ? '#587C74' : '#BB463C',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div style={{
                ...styles.infoBox,
                backgroundColor: '#e8f0f4',
                borderLeft: '4px solid #2F3E46'
              }}>
                <p style={{margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#2F3E46'}}>
                  Startup Cost Recovery: {monthsToRecoverStartup > 0 
                    ? `${monthsToRecoverStartup.toFixed(1)} months (${(monthsToRecoverStartup / 12).toFixed(1)} years) to recover €${totalStartupCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})} investment`
                    : 'Not yet profitable - cannot recover startup costs'}
                </p>
              </div>
            </div>

            {/* 24-Month Profit Projection */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>24-Month Profit Projection</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month" 
                    label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    label={{ value: 'Cumulative Profit (€)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => `€${value.toLocaleString('nl-NL', {minimumFractionDigits: 2})}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="breakEven" 
                    stroke="#999" 
                    strokeDasharray="5 5" 
                    name="Break-Even Line"
                    dot={false}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="cumulativeProfit" 
                    stroke="#587C74" 
                    strokeWidth={2}
                    name="Cumulative Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Labor Capacity Analysis (Kees Units) */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>⏱️ Labor Capacity Analysis (Kees Units)</h2>
              
              <div style={{
                ...styles.infoBox,
                backgroundColor: '#e8f4f1',
                borderLeft: '4px solid #587C74',
                marginTop: '16px',
                marginBottom: '24px'
              }}>
                <p style={{margin: 0, fontSize: '14px', color: '#282828'}}>
                  💡 <strong>What are Kees Units?</strong> 1 Kees Unit = 1 minute of butcher labor. 
                  This shows if your sales plan is realistic given available prep time.
                </p>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px'}}>
                    Hours per Day:
                  </label>
                  <input
                    type="number"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 0)}
                    style={{...styles.input, width: '100px'}}
                    min="0"
                    step="0.5"
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px'}}>
                    Days per Month:
                  </label>
                  <input
                    type="number"
                    value={daysPerMonth}
                    onChange={(e) => setDaysPerMonth(parseInt(e.target.value) || 0)}
                    style={{...styles.input, width: '100px'}}
                    min="0"
                    step="1"
                  />
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px'}}>
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#e8f4f1',
                  borderLeft: '4px solid #2F3E46',
                  margin: 0
                }}>
                  <div style={{fontSize: '14px', color: '#666', marginBottom: '4px'}}>Available</div>
                  <div style={{fontSize: '28px', fontWeight: 'bold', color: '#2F3E46'}}>
                    {availableMinutesPerMonth.toLocaleString()} min
                  </div>
                </div>
                
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#ffe5e5',
                  borderLeft: '4px solid #BB463C',
                  margin: 0
                }}>
                  <div style={{fontSize: '14px', color: '#666', marginBottom: '4px'}}>Used</div>
                  <div style={{fontSize: '28px', fontWeight: 'bold', color: '#BB463C'}}>
                    {usedMinutes.toLocaleString()} min
                  </div>
                </div>
                
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: remainingMinutes < 0 ? '#ffe5e5' : '#e8f4f1',
                  borderLeft: `4px solid ${remainingMinutes < 0 ? '#BB463C' : '#587C74'}`,
                  margin: 0
                }}>
                  <div style={{fontSize: '14px', color: '#666', marginBottom: '4px'}}>Remaining</div>
                  <div style={{fontSize: '28px', fontWeight: 'bold', color: remainingMinutes < 0 ? '#BB463C' : '#587C74'}}>
                    {remainingMinutes.toLocaleString()} min
                  </div>
                </div>
                
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: utilizationPercentage > 100 ? '#ffe5e5' : '#e8f4f1',
                  borderLeft: `4px solid ${utilizationPercentage > 100 ? '#BB463C' : '#587C74'}`,
                  margin: 0
                }}>
                  <div style={{fontSize: '14px', color: '#666', marginBottom: '4px'}}>Utilization</div>
                  <div style={{fontSize: '28px', fontWeight: 'bold', color: utilizationPercentage > 100 ? '#BB463C' : '#587C74'}}>
                    {utilizationPercentage.toFixed(1)}%
                  </div>
                  {utilizationPercentage > 100 && (
                    <div style={{fontSize: '12px', color: '#BB463C', marginTop: '4px'}}>
                      ✗ IMPOSSIBLE
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div style={styles.progressBar}>
                <div style={{
                  width: `${Math.min(utilizationPercentage, 100)}%`,
                  height: '100%',
                  backgroundColor: utilizationPercentage > 100 ? '#BB463C' : utilizationPercentage > 80 ? '#F2CC8F' : '#587C74',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {utilizationPercentage > 100 && (
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#ffe5e5',
                  borderLeft: '4px solid #BB463C',
                  marginTop: '16px'
                }}>
                  <p style={{margin: 0, fontSize: '14px', color: '#282828'}}>
                    ⚠️ <strong>WARNING:</strong> You're planning to sell more than Kees can physically prepare! 
                    Reduce sales volumes by {((utilizationPercentage - 100) / utilizationPercentage * 100).toFixed(0)}% or hire help.
                  </p>
                </div>
              )}
            </div>

            {/* Seasonality Analysis */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📅 Seasonality & Annual Performance</h2>
              
              <div style={{
                ...styles.infoBox,
                backgroundColor: '#fff3cd',
                borderLeft: '4px solid #F2CC8F',
                marginTop: '16px',
                marginBottom: '24px'
              }}>
                <p style={{margin: 0, fontSize: '14px', color: '#282828'}}>
                  💡 <strong>Why This Matters:</strong> BBQ demand fluctuates by season. Summer is peak (BBQ season), 
                  winter is slower. These multipliers let you model realistic monthly variations from your baseline sales.
                  Set 100% = baseline (current product volumes), then adjust each month up or down.
                </p>
              </div>

              {/* Annual Summary Cards */}
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px'}}>
                <div style={{...styles.metricCard, padding: '16px'}}>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Annual Revenue</div>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#587C74'}}>
                    €{annualRevenue.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </div>
                </div>
                
                <div style={{...styles.metricCard, padding: '16px'}}>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Annual Net Profit</div>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: annualNetProfit >= 0 ? '#587C74' : '#BB463C'}}>
                    €{annualNetProfit.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </div>
                </div>
                
                <div style={{...styles.metricCard, padding: '16px'}}>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Avg Monthly Profit</div>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: avgMonthlyNetProfit >= 0 ? '#587C74' : '#BB463C'}}>
                    €{avgMonthlyNetProfit.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </div>
                </div>
                
                <div style={{...styles.metricCard, padding: '16px'}}>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Best Month</div>
                  <div style={{fontSize: '20px', fontWeight: 'bold', color: '#587C74'}}>
                    {bestMonth.month}
                  </div>
                  <div style={{fontSize: '14px', color: '#666'}}>
                    €{bestMonth.netProfit.toFixed(0)}
                  </div>
                </div>
                
                <div style={{...styles.metricCard, padding: '16px'}}>
                  <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>Worst Month</div>
                  <div style={{fontSize: '20px', fontWeight: 'bold', color: worstMonth.netProfit >= 0 ? '#F2CC8F' : '#BB463C'}}>
                    {worstMonth.month}
                  </div>
                  <div style={{fontSize: '14px', color: '#666'}}>
                    €{worstMonth.netProfit.toFixed(0)}
                  </div>
                </div>
              </div>

              {/* Monthly Performance Chart */}
              <div style={{marginBottom: '32px'}}>
                <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#2F3E46', marginBottom: '16px'}}>
                  Monthly Performance Across Year
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={seasonalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      yAxisId="left"
                      label={{ value: 'Profit (€)', angle: -90, position: 'insideLeft' }}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right"
                      label={{ value: 'Multiplier (%)', angle: 90, position: 'insideRight' }}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => {
                        if (name === 'multiplier') return `${value}%`;
                        return `€${value.toFixed(2)}`;
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="multiplier" 
                      stroke="#F2CC8F" 
                      strokeWidth={2}
                      name="Demand Multiplier (%)"
                      dot={{ r: 4 }}
                    />
                    <Bar 
                      yAxisId="left"
                      dataKey="netProfit" 
                      name="Net Profit (€)"
                    >
                      {seasonalData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.netProfit >= 0 ? '#587C74' : '#BB463C'} />
                      ))}
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Seasonality Multipliers Input */}
              <div>
                <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#2F3E46', marginBottom: '16px'}}>
                  Adjust Seasonal Multipliers (% of Baseline)
                </h3>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px'}}>
                  {monthKeys.map((key, index) => (
                    <div key={key}>
                      <label style={{display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px', color: '#2F3E46'}}>
                        {monthNames[index]}
                      </label>
                      <div style={{display: 'flex', alignItems: 'center', gap: '4px'}}>
                        <input
                          type="number"
                          value={seasonalityMultipliers[key]}
                          onChange={(e) => setSeasonalityMultipliers({
                            ...seasonalityMultipliers,
                            [key]: parseInt(e.target.value) || 0
                          })}
                          style={{...styles.input, padding: '6px', fontSize: '13px'}}
                          min="0"
                          step="5"
                        />
                        <span style={{fontSize: '13px', color: '#666'}}>%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
                  <button
                    onClick={() => setSeasonalityMultipliers({
                      jan: 100, feb: 100, mar: 100, apr: 100, may: 100, jun: 100,
                      jul: 100, aug: 100, sep: 100, oct: 100, nov: 100, dec: 100
                    })}
                    style={{
                      ...styles.button,
                      backgroundColor: '#2F3E46',
                      fontSize: '13px',
                      padding: '8px 16px'
                    }}
                  >
                    Reset to 100% (No Seasonality)
                  </button>
                  
                  <button
                    onClick={() => setSeasonalityMultipliers({
                      jan: 70, feb: 70, mar: 85, apr: 100, may: 120, jun: 140,
                      jul: 150, aug: 145, sep: 120, oct: 100, nov: 80, dec: 90
                    })}
                    style={{
                      ...styles.button,
                      fontSize: '13px',
                      padding: '8px 16px'
                    }}
                  >
                    Apply BBQ Seasonality Pattern
                  </button>
                </div>
              </div>

              {/* Monthly Breakdown Table */}
              <div style={{marginTop: '32px', overflowX: 'auto'}}>
                <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#2F3E46', marginBottom: '16px'}}>
                  Detailed Monthly Breakdown
                </h3>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.tableHeader, textAlign: 'left'}}>Month</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Multiplier</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Revenue</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>COGS</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Gross Margin</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Operating Expenses</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Net Profit</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Capacity Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seasonalData.map((month, index) => (
                      <tr key={index} style={{backgroundColor: month.netProfit >= 0 ? '#f0f7f5' : '#fff5f5'}}>
                        <td style={{...styles.tableCell, fontWeight: '500'}}>{month.month}</td>
                        <td style={{...styles.tableCell, textAlign: 'right'}}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: month.multiplier >= 100 ? '#e8f4f1' : '#fff3cd',
                            color: month.multiplier >= 100 ? '#587C74' : '#BB463C'
                          }}>
                            {month.multiplier}%
                          </span>
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right', color: '#587C74'}}>
                          €{month.revenue.toFixed(0)}
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                          €{month.cost.toFixed(0)}
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right', fontWeight: '500'}}>
                          €{month.margin.toFixed(0)}
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right'}}>
                          €{month.opex.toFixed(0)}
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right', fontWeight: 'bold', color: month.netProfit >= 0 ? '#587C74' : '#BB463C'}}>
                          €{month.netProfit.toFixed(0)}
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right'}}>
                          <span style={{color: month.utilization > 100 ? '#BB463C' : month.utilization > 85 ? '#F2CC8F' : '#587C74'}}>
                            {month.utilization.toFixed(0)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{backgroundColor: '#f5f5f5', fontWeight: 'bold', borderTop: '2px solid #2F3E46'}}>
                      <td style={{...styles.tableCell, textAlign: 'left'}}>ANNUAL TOTAL</td>
                      <td style={{...styles.tableCell, textAlign: 'right'}}>-</td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#587C74'}}>
                        €{annualRevenue.toFixed(0)}
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                        €{annualCost.toFixed(0)}
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right'}}>
                        €{annualMargin.toFixed(0)}
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right'}}>
                        €{annualOpex.toFixed(0)}
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: annualNetProfit >= 0 ? '#587C74' : '#BB463C'}}>
                        €{annualNetProfit.toFixed(0)}
                      </td>
                      <td style={styles.tableCell}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Cash Flow Warning */}
              {worstMonth.netProfit < 0 && (
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#ffe5e5',
                  borderLeft: '4px solid #BB463C',
                  marginTop: '24px'
                }}>
                  <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#BB463C', marginBottom: '8px'}}>
                    ⚠️ Cash Flow Alert
                  </h3>
                  <p style={{margin: 0, fontSize: '14px', color: '#282828', lineHeight: '1.6'}}>
                    <strong>Warning:</strong> You'll lose money in {seasonalData.filter(m => m.netProfit < 0).length} months of the year.
                    Worst month: {worstMonth.month} (€{worstMonth.netProfit.toFixed(0)} loss).
                    <br /><br />
                    <strong>Cash Reserve Needed:</strong> You need at least €{Math.abs(worstMonth.netProfit * 3).toFixed(0)} 
                    in working capital to survive slow months (3x worst month).
                    <br /><br />
                    <strong>Options:</strong>
                    <ul style={{marginTop: '8px', marginBottom: 0, paddingLeft: '20px'}}>
                      <li>Build up cash during peak season (summer)</li>
                      <li>Reduce fixed costs in winter (fewer staff hours)</li>
                      <li>Add winter product lines (holiday catering, gift boxes)</li>
                      <li>Adjust prices to improve margins</li>
                    </ul>
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Product Comparison Chart */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>🎯 Product Performance Comparison</h2>
              
              <div style={{
                ...styles.infoBox,
                backgroundColor: '#fff3cd',
                borderLeft: '4px solid #F2CC8F',
                marginTop: '16px',
                marginBottom: '24px'
              }}>
                <p style={{margin: 0, fontSize: '14px', color: '#282828'}}>
                  💡 <strong>Key Insight:</strong> Higher margin doesn't always mean more profit! 
                  Check "Hourly Potential" to see which products make the most money per hour of labor.
                </p>
              </div>

              {/* Chart Controls */}
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px'}}>
                <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={showMargin}
                    onChange={(e) => setShowMargin(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={{fontSize: '14px', fontWeight: '500'}}>Margin per Unit (€)</span>
                </label>
                
                <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={showThroughput}
                    onChange={(e) => setShowThroughput(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={{fontSize: '14px', fontWeight: '500'}}>Units per Hour</span>
                </label>
                
                <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={showHourlyPotential}
                    onChange={(e) => setShowHourlyPotential(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={{fontSize: '14px', fontWeight: '500', color: '#587C74'}}>
                    💰 Hourly Profit Potential (€)
                  </span>
                </label>
                
                <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={showMonthlySalesPotential}
                    onChange={(e) => setShowMonthlySalesPotential(e.target.checked)}
                    style={styles.checkbox}
                  />
                  <span style={{fontSize: '14px', fontWeight: '500', color: '#2F3E46'}}>
                    Monthly Sales Potential (€)
                  </span>
                </label>
              </div>

              <ResponsiveContainer width="100%" height={400}>
                <ComposedChart data={comparisonChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={150}
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => value.toFixed(2)}
                    labelFormatter={(label) => {
                      const item = comparisonChartData.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <Legend />
                  
                  {showMargin && (
                    <Bar dataKey="margin" fill="#BB463C" name="Margin per Unit (€)" />
                  )}
                  
                  {showThroughput && (
                    <Bar dataKey="unitsPerHour" fill="#F2CC8F" name="Units per Hour" />
                  )}
                  
                  {showHourlyPotential && (
                    <Bar dataKey="hourlyPotential" fill="#587C74" name="Hourly Profit Potential (€)" />
                  )}
                  
                  {showMonthlySalesPotential && (
                    <Bar dataKey="monthlySalesPotential" fill="#2F3E46" name="Monthly Sales Potential (€)" />
                  )}
                </ComposedChart>
              </ResponsiveContainer>

              <div style={{
                ...styles.infoBox,
                backgroundColor: '#e8f4f1',
                borderLeft: '4px solid #587C74',
                marginTop: '24px'
              }}>
                <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#2F3E46', marginBottom: '12px'}}>
                  📊 How to Read This Chart
                </h3>
                <ul style={{margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#282828', lineHeight: '1.8'}}>
                  <li><strong>Margin per Unit:</strong> Raw profit per product sold</li>
                  <li><strong>Units per Hour:</strong> How many you can prepare in 60 minutes</li>
                  <li><strong>Hourly Profit Potential:</strong> Total profit if you spent 1 hour making only this product</li>
                  <li><strong>Monthly Sales Potential:</strong> Maximum profit if you dedicated all capacity to this product</li>
                </ul>
                <p style={{marginTop: '12px', marginBottom: 0, fontSize: '14px', color: '#282828'}}>
                  <strong>💡 Strategic Tip:</strong> Products with high "Hourly Profit Potential" give you the best return on your limited butcher time!
                </p>
              </div>
            </div>

            {/* Product Efficiency Ranking */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>🏆 Product Efficiency Ranking (€/Minute)</h2>
              
              <div style={{
                ...styles.infoBox,
                backgroundColor: '#fff3cd',
                borderLeft: '4px solid #F2CC8F',
                marginTop: '16px',
                marginBottom: '16px'
              }}>
                <p style={{margin: 0, fontSize: '14px', color: '#282828'}}>
                  💡 <strong>Key Insight:</strong> Products at the top make MORE money per minute of Kees' time. 
                  Focus on promoting these high-efficiency items!
                </p>
              </div>

              <ResponsiveContainer width="100%" height={Math.max(300, productEfficiency.length * 40)}>
                <BarChart data={productEfficiency} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" label={{ value: '€ per Minute', position: 'insideBottom', offset: -5 }} />
                  <YAxis dataKey="name" type="category" width={180} style={{ fontSize: '13px' }} />
                  <Tooltip 
                    formatter={(value: number) => `€${value.toFixed(2)}/min`}
                    labelFormatter={(label) => label}
                  />
                  <Bar dataKey="euroPerMinute" name="€ per Minute">
                    {productEfficiency.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.category === 'Classic' ? COLORS.classic : COLORS.pitmaster} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Efficiency breakdown table */}
              <div style={{marginTop: '24px', overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.tableHeader, textAlign: 'left'}}>Product</th>
                      <th style={{...styles.tableHeader, textAlign: 'center'}}>Category</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Margin/Unit</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>€/Minute</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>€/Hour</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Units/Hour</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Current Units</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Max Monthly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productEfficiency.map((p, idx) => (
                      <tr key={idx} style={{backgroundColor: p.category === 'Classic' ? '#f8f9fa' : '#f0f7f5'}}>
                        <td style={styles.tableCell}>{p.name}</td>
                        <td style={{...styles.tableCell, textAlign: 'center'}}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            backgroundColor: p.category === 'Classic' ? '#e8f0f4' : '#e8f4f1',
                            color: p.category === 'Classic' ? COLORS.classic : COLORS.pitmaster
                          }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right'}}>€{p.margin.toFixed(2)}</td>
                        <td style={{...styles.tableCell, textAlign: 'right', fontWeight: 'bold', color: '#587C74'}}>
                          €{p.euroPerMinute.toFixed(2)}
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right', fontWeight: 'bold', color: '#2F3E46'}}>
                          €{p.euroPerHour.toFixed(2)}
                        </td>
                        <td style={{...styles.tableCell, textAlign: 'right'}}>{p.unitsPerHour.toFixed(1)}</td>
                        <td style={{...styles.tableCell, textAlign: 'right'}}>{p.currentUnits}</td>
                        <td style={{...styles.tableCell, textAlign: 'right', color: '#666'}}>{p.maxMonthlySales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top 10 Products by Margin Contribution */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Top 10 Products by Margin Contribution</h2>
              
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topProductsByMargin}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} style={{ fontSize: '12px' }} />
                  <YAxis label={{ value: '€', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    formatter={(value: number) => `€${value.toFixed(2)}`}
                  />
                  <Bar dataKey="totalMarginContribution" name="Total Margin Contribution (€)">
                    {topProductsByMargin.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.category === 'Classic' ? COLORS.classic : COLORS.pitmaster} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              <div style={{marginTop: '16px', fontSize: '14px', color: '#666', textAlign: 'center'}}>
                These products contribute the most to your total gross margin based on current sales volumes
              </div>
            </div>

            {/* Classic vs Pitmaster Comparison */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>📊 Classic vs Pitmaster Performance</h2>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '24px'}}>
                <div style={{...styles.infoBox, backgroundColor: '#e8f0f4', borderLeft: `4px solid ${COLORS.classic}`, margin: 0}}>
                  <h3 style={{fontSize: '16px', fontWeight: 'bold', color: COLORS.classic, marginBottom: '12px'}}>
                    🥩 Classic Products
                  </h3>
                  <div style={{fontSize: '14px', color: '#282828', lineHeight: '1.8'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Revenue:</strong></span>
                      <span style={{fontWeight: 'bold', color: COLORS.classic}}>
                        €{calculations.classicRevenue.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>COGS:</strong></span>
                      <span>€{calculations.classicCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Gross Margin:</strong></span>
                      <span style={{fontWeight: 'bold', color: calculations.classicMargin >= 0 ? '#587C74' : '#BB463C'}}>
                        €{calculations.classicMargin.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Units Sold:</strong></span>
                      <span>{calculations.classicUnits} ({((calculations.classicUnits / calculations.totalUnits) * 100).toFixed(1)}%)</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Avg Margin/Unit:</strong></span>
                      <span style={{fontWeight: 'bold'}}>€{calculations.classicAvgMargin.toFixed(2)}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span><strong>Prep Time:</strong></span>
                      <span>{calculations.classicPrepTime} min ({((calculations.classicPrepTime / calculations.totalPrepTime) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>

                <div style={{...styles.infoBox, backgroundColor: '#e8f4f1', borderLeft: `4px solid ${COLORS.pitmaster}`, margin: 0}}>
                  <h3 style={{fontSize: '16px', fontWeight: 'bold', color: COLORS.pitmaster, marginBottom: '12px'}}>
                    👨‍🍳 Pitmaster Products
                  </h3>
                  <div style={{fontSize: '14px', color: '#282828', lineHeight: '1.8'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Revenue:</strong></span>
                      <span style={{fontWeight: 'bold', color: COLORS.pitmaster}}>
                        €{calculations.pitmasterRevenue.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>COGS:</strong></span>
                      <span>€{calculations.pitmasterCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Gross Margin:</strong></span>
                      <span style={{fontWeight: 'bold', color: calculations.pitmasterMargin >= 0 ? '#587C74' : '#BB463C'}}>
                        €{calculations.pitmasterMargin.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Units Sold:</strong></span>
                      <span>{calculations.pitmasterUnits} ({((calculations.pitmasterUnits / calculations.totalUnits) * 100).toFixed(1)}%)</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Avg Margin/Unit:</strong></span>
                      <span style={{fontWeight: 'bold'}}>€{calculations.pitmasterAvgMargin.toFixed(2)}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <span><strong>Prep Time:</strong></span>
                      <span>{calculations.pitmasterPrepTime} min ({((calculations.pitmasterPrepTime / calculations.totalPrepTime) * 100).toFixed(1)}%)</span>
                    </div>
                  </div>
                </div>

                <div style={{...styles.infoBox, backgroundColor: netProfit >= 0 ? '#e8f4f1' : '#ffe5e5', borderLeft: `4px solid ${netProfit >= 0 ? '#587C74' : '#BB463C'}`, margin: 0}}>
                  <h3 style={{fontSize: '16px', fontWeight: 'bold', color: netProfit >= 0 ? '#587C74' : '#BB463C', marginBottom: '12px'}}>
                    💰 Net Position
                  </h3>
                  <div style={{fontSize: '14px', color: '#282828', lineHeight: '1.8'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Gross Margin:</strong></span>
                      <span>€{calculations.totalMargin.toLocaleString('nl-NL', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                      <span><strong>Operating Expenses:</strong></span>
                      <span>€{totalOperatingExpenses.toLocaleString('nl-NL', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingTop: '8px', borderTop: '1px solid #d4d4d4'}}>
                      <span><strong>Net Profit:</strong></span>
                      <span style={{fontSize: '18px', fontWeight: 'bold', color: netProfit >= 0 ? '#587C74' : '#BB463C'}}>
                        €{netProfit.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                      </span>
                    </div>
                    <div style={{fontSize: '12px', color: '#666', marginTop: '12px'}}>
                      {netProfit >= 0 
                        ? '✅ Operating above break-even point' 
                        : `⚠️ Need €${Math.abs(netProfit).toFixed(2)} more in revenue or reduce costs`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategic Insights */}
              <div style={{...styles.infoBox, backgroundColor: '#fff3cd', borderLeft: '4px solid #BB463C', marginTop: '24px'}}>
                <h3 style={{fontSize: '16px', fontWeight: 'bold', color: '#BB463C', marginBottom: '12px'}}>
                  💡 Strategic Insights
                </h3>
                <ul style={{margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#282828', lineHeight: '1.8'}}>
                  <li>
                    <strong>Margin Efficiency:</strong> Pitmaster products generate €{calculations.pitmasterAvgMargin.toFixed(2)} 
                    margin per unit vs €{calculations.classicAvgMargin.toFixed(2)} for Classic products 
                    ({calculations.pitmasterAvgMargin > Math.abs(calculations.classicAvgMargin) ? 
                      `${((calculations.pitmasterAvgMargin / Math.max(Math.abs(calculations.classicAvgMargin), 0.01)) * 100).toFixed(0)}% better` : 
                      'lower'})
                  </li>
                  <li>
                    <strong>Time ROI:</strong> Classic products take {calculations.classicPrepTime} min 
                    ({((calculations.classicPrepTime / calculations.totalPrepTime) * 100).toFixed(1)}% of capacity) 
                    generating {((calculations.classicRevenue / calculations.totalRevenue) * 100).toFixed(1)}% of revenue
                  </li>
                  <li>
                    <strong>Volume Strategy:</strong> Currently selling {calculations.classicUnits} Classic units 
                    and {calculations.pitmasterUnits} Pitmaster units. 
                    {calculations.pitmasterMargin > calculations.classicMargin && 
                      ' Consider increasing Pitmaster production for higher margins.'}
                  </li>
                  <li>
                    <strong>Break-Even Analysis:</strong> Need {breakEvenUnits} total units to cover operating costs. 
                    Current mix: {calculations.classicUnits} Classic + {calculations.pitmasterUnits} Pitmaster = {calculations.totalUnits} units
                    {calculations.totalUnits < breakEvenUnits && ` (need ${breakEvenUnits - calculations.totalUnits} more units)`}
                  </li>
                </ul>
              </div>
            </div>

            {/* Product Details Table with Filter */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Monthly Sales Volume Input</h2>
                <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={() => setCategoryFilter('all')}
                      style={{
                        ...styles.filterButton,
                        ...(categoryFilter === 'all' ? styles.filterButtonActive : {})
                      }}
                    >
                      All Products
                    </button>
                    <button
                      onClick={() => setCategoryFilter('Classic')}
                      style={{
                        ...styles.filterButton,
                        ...(categoryFilter === 'Classic' ? styles.filterButtonActive : {})
                      }}
                    >
                      Classic Only
                    </button>
                    <button
                      onClick={() => setCategoryFilter('Pitmaster')}
                      style={{
                        ...styles.filterButton,
                        ...(categoryFilter === 'Pitmaster' ? styles.filterButtonActive : {})
                      }}
                    >
                      Pitmaster Only
                    </button>
                  </div>
                  <button
                    onClick={addProduct}
                    onMouseEnter={() => setHoveredButton('add-product')}
                    onMouseLeave={() => setHoveredButton(null)}
                    style={{
                      ...styles.button,
                      ...(hoveredButton === 'add-product' ? styles.buttonHover : {})
                    }}
                  >
                    + Add Product
                  </button>
                </div>
              </div>
              <div style={{overflowX: 'auto'}}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{...styles.tableHeader, minWidth: '180px'}}>Product</th>
                      <th style={{...styles.tableHeader, minWidth: '130px'}}>Category</th>
                      <th style={{...styles.tableHeader, minWidth: '120px'}}>Meat Type</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Weight (kg)</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Base Cost (€)</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Waste %</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Prep (min)</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>True Cost (€)</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Sell (€)</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Margin (€)</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>€/min</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Units/Mo</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Kees Units</th>
                      <th style={{...styles.tableHeader, textAlign: 'right'}}>Total Margin (€)</th>
                      <th style={styles.tableHeader}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const trueCost = product.costPrice / (1 - product.wastePercentage / 100);
                      const totalCost = trueCost * product.weight;
                      const euroPerMin = product.prepTimeMinutes > 0 ? product.margin / product.prepTimeMinutes : 0;
                      const keesUnits = calculations.totalUnits > 0 ? product.units * (product.units / calculations.totalUnits) : 0;
                      const totalMargin = product.margin * product.units;

                      return (
                        <tr key={product.id} style={{backgroundColor: product.category === 'Classic' ? '#f8f9fa' : '#f0f7f5'}}>
                          <td 
                            style={{...styles.tableCell, position: 'relative'}}
                            onMouseEnter={() => setHoveredCell(`product-${product.id}`)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                              style={{...styles.input, minWidth: '170px'}}
                            />
                            {hoveredCell === `product-${product.id}` && (
                              <div style={styles.tooltip}>{product.name}</div>
                            )}
                          </td>
                          <td 
                            style={{...styles.tableCell, position: 'relative'}}
                            onMouseEnter={() => setHoveredCell(`category-${product.id}`)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <select
                              value={product.category}
                              onChange={(e) => updateProduct(product.id, 'category', e.target.value as 'Classic' | 'Pitmaster')}
                              style={{...styles.select, minWidth: '120px'}}
                            >
                              <option value="Classic">Classic</option>
                              <option value="Pitmaster">Pitmaster</option>
                            </select>
                            {hoveredCell === `category-${product.id}` && (
                              <div style={styles.tooltip}>{product.category}</div>
                            )}
                          </td>
                          <td 
                            style={{...styles.tableCell, position: 'relative'}}
                            onMouseEnter={() => setHoveredCell(`meat-${product.id}`)}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <select
                              value={product.meatType}
                              onChange={(e) => updateProduct(product.id, 'meatType', e.target.value as 'Beef' | 'Pork' | 'Poultry')}
                              style={{...styles.select, minWidth: '110px'}}
                            >
                              <option value="Beef">Beef</option>
                              <option value="Pork">Pork</option>
                              <option value="Poultry">Poultry</option>
                            </select>
                            {hoveredCell === `meat-${product.id}` && (
                              <div style={styles.tooltip}>{product.meatType}</div>
                            )}
                          </td>
                          <td style={styles.tableCell}>
                            <input
                              type="number"
                              step="0.1"
                              value={product.weight}
                              onChange={(e) => updateProduct(product.id, 'weight', parseFloat(e.target.value) || 0)}
                              style={styles.inputSmall}
                            />
                          </td>
                          <td style={styles.tableCell}>
                            <input
                              type="number"
                              step="0.01"
                              value={product.costPrice}
                              onChange={(e) => updateProduct(product.id, 'costPrice', parseFloat(e.target.value) || 0)}
                              style={styles.inputSmall}
                            />
                          </td>
                          <td style={styles.tableCell}>
                            <input
                              type="number"
                              step="1"
                              value={product.wastePercentage}
                              onChange={(e) => updateProduct(product.id, 'wastePercentage', parseFloat(e.target.value) || 0)}
                              style={styles.inputSmall}
                            />
                          </td>
                          <td style={styles.tableCell}>
                            <input
                              type="number"
                              step="1"
                              value={product.prepTimeMinutes}
                              onChange={(e) => updateProduct(product.id, 'prepTimeMinutes', parseFloat(e.target.value) || 0)}
                              style={styles.inputSmall}
                            />
                          </td>
                          <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                            €{totalCost.toFixed(2)}
                          </td>
                          <td style={styles.tableCell}>
                            <input
                              type="number"
                              step="1"
                              value={product.sellPrice}
                              onChange={(e) => updateProduct(product.id, 'sellPrice', parseFloat(e.target.value) || 0)}
                              style={styles.inputSmall}
                            />
                          </td>
                          <td style={{...styles.tableCell, textAlign: 'right', color: product.margin >= 0 ? '#587C74' : '#BB463C', fontWeight: 'bold'}}>
                            €{product.margin.toFixed(2)}
                          </td>
                          <td style={{...styles.tableCell, textAlign: 'right', color: euroPerMin >= 5 ? '#587C74' : euroPerMin >= 3 ? '#F2CC8F' : '#BB463C'}}>
                            €{euroPerMin.toFixed(2)}
                          </td>
                          <td style={styles.tableCell}>
                            <input
                              type="number"
                              step="1"
                              value={product.units}
                              onChange={(e) => updateProduct(product.id, 'units', parseInt(e.target.value) || 0)}
                              style={styles.inputSmall}
                            />
                          </td>
                          <td style={{...styles.tableCell, textAlign: 'right'}}>
                            {keesUnits.toFixed(0)}
                          </td>
                          <td style={{...styles.tableCell, textAlign: 'right', color: totalMargin >= 0 ? '#587C74' : '#BB463C', fontWeight: 'bold'}}>
                            €{totalMargin.toFixed(2)}
                          </td>
                          <td style={styles.tableCell}>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              style={styles.deleteButton}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>
                      <td colSpan={7} style={{...styles.tableCell, textAlign: 'right'}}>
                        {categoryFilter !== 'all' ? `${categoryFilter} TOTALS:` : 'ALL TOTALS:'}
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                        €{filteredProducts.reduce((sum, p) => {
                          const trueCost = p.costPrice / (1 - p.wastePercentage / 100);
                          return sum + (trueCost * p.weight * p.units);
                        }, 0).toFixed(2)}
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#587C74'}}>
                        €{filteredProducts.reduce((sum, p) => sum + (p.sellPrice * p.units), 0).toFixed(2)}
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#587C74'}}>
                        €{filteredProducts.reduce((sum, p) => sum + (p.margin * p.units), 0).toFixed(2)}
                      </td>
                      <td style={styles.tableCell}></td>
                      <td style={{...styles.tableCell, textAlign: 'right'}}>
                        {filteredProducts.reduce((sum, p) => sum + p.units, 0)}
                      </td>
                      <td style={styles.tableCell}></td>
                      <td style={{...styles.tableCell, textAlign: 'right', color: '#587C74'}}>
                        €{filteredProducts.reduce((sum, p) => sum + (p.margin * p.units), 0).toFixed(2)}
                      </td>
                      <td style={styles.tableCell}></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'startup' && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Startup Investment Required</h2>
                <p style={{fontSize: '28px', fontWeight: 'bold', color: '#2F3E46', marginTop: '8px'}}>
                  Total: €{totalStartupCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </p>
                <div style={{marginTop: '8px', display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: '#e8f4f1',
                    color: '#587C74'
                  }}>
                    Paid: €{totalPaid.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </span>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: '#ffe5e5',
                    color: '#BB463C'
                  }}>
                    Remaining: €{(totalStartupCost - totalPaid).toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>
              <button
                onClick={addStartupCost}
                onMouseEnter={() => setHoveredButton('add-startup')}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                  ...styles.button,
                  ...(hoveredButton === 'add-startup' ? styles.buttonHover : {})
                }}
              >
                + Add Cost
              </button>
            </div>
            <div style={styles.progressBar}>
              <div style={{
                width: `${(totalPaid / totalStartupCost) * 100}%`,
                height: '100%',
                backgroundColor: '#587C74',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 'bold',
                transition: 'width 0.3s ease'
              }}>
                {((totalPaid / totalStartupCost) * 100).toFixed(0)}%
              </div>
            </div>
            <div style={{overflowX: 'auto', marginTop: '24px'}}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{...styles.tableHeader, textAlign: 'left'}}>Category</th>
                    <th style={{...styles.tableHeader, textAlign: 'left'}}>Item</th>
                    <th style={{...styles.tableHeader, textAlign: 'right'}}>Estimated (€)</th>
                    <th style={{...styles.tableHeader, textAlign: 'right'}}>Actual (€)</th>
                    <th style={{...styles.tableHeader, textAlign: 'center'}}>Status</th>
                    <th style={{...styles.tableHeader, textAlign: 'left'}}>Notes</th>
                    <th style={styles.tableHeader}></th>
                  </tr>
                </thead>
                <tbody>
                  {startupCosts.map((cost) => (
                    <tr key={cost.id}>
                      <td style={styles.tableCell}>
                        <input
                          type="text"
                          value={cost.category}
                          onChange={(e) => updateStartupCost(cost.id, 'category', e.target.value)}
                          style={styles.input}
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <input
                          type="text"
                          value={cost.item}
                          onChange={(e) => updateStartupCost(cost.id, 'item', e.target.value)}
                          style={styles.input}
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <input
                          type="number"
                          step="0.01"
                          value={cost.estimatedCost}
                          onChange={(e) => updateStartupCost(cost.id, 'estimatedCost', parseFloat(e.target.value) || 0)}
                          style={{...styles.inputSmall, width: '110px'}}
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <input
                          type="number"
                          step="0.01"
                          value={cost.actualCost}
                          onChange={(e) => updateStartupCost(cost.id, 'actualCost', parseFloat(e.target.value) || 0)}
                          style={{...styles.inputSmall, width: '110px'}}
                        />
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'center'}}>
                        <input
                          type="checkbox"
                          checked={cost.paid}
                          onChange={(e) => updateStartupCost(cost.id, 'paid', e.target.checked)}
                          style={{width: '20px', height: '20px', cursor: 'pointer'}}
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <input
                          type="text"
                          value={cost.notes}
                          onChange={(e) => updateStartupCost(cost.id, 'notes', e.target.value)}
                          style={styles.input}
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          onClick={() => deleteStartupCost(cost.id)}
                          style={styles.deleteButton}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>
                    <td colSpan={2} style={{...styles.tableCell, textAlign: 'right'}}>TOTALS:</td>
                    <td style={{...styles.tableCell, textAlign: 'right'}}>
                      €{startupCosts.reduce((sum, c) => sum + c.estimatedCost, 0).toFixed(2)}
                    </td>
                    <td style={{...styles.tableCell, textAlign: 'right', color: '#2F3E46'}}>
                      €{totalStartupCost.toFixed(2)}
                    </td>
                    <td colSpan={3} style={styles.tableCell}></td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div style={{
              ...styles.infoBox,
              backgroundColor: '#e8f4f1',
              borderLeft: '4px solid #587C74'
            }}>
              <h3 style={{color: '#2F3E46', fontSize: '16px', fontWeight: 'bold', marginBottom: '8px'}}>
                💰 Working Capital Breakdown
              </h3>
              <ul style={{color: '#282828', fontSize: '14px', margin: 0, paddingLeft: '20px'}}>
                <li><strong>Initial Inventory (€8,000):</strong> First month's meat stock to fill display cases</li>
                <li><strong>Cash Reserve (€14,040):</strong> 2 months of fixed costs as safety buffer</li>
                <li><strong>Emergency Fund (€5,000):</strong> Unexpected repairs, equipment failures, etc.</li>
              </ul>
              <p style={{color: '#282828', fontSize: '14px', marginTop: '12px', marginBottom: 0}}>
                <strong>Why this matters:</strong> You need cash on hand before sales start coming in. 
                This ensures you can pay suppliers, rent, and staff while building your customer base.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'monthly' && (
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>Monthly Recurring Costs</h2>
                <p style={{fontSize: '28px', fontWeight: 'bold', color: '#BB463C', marginTop: '8px'}}>
                  Total Operating: €{totalMonthlyOpex.toLocaleString('nl-NL', {minimumFractionDigits: 2})}/month
                </p>
                <p style={{fontSize: '16px', color: '#282828'}}>
                  Annual: €{(totalMonthlyOpex * 12).toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </p>
              </div>
              <button
                onClick={addMonthlyCost}
                onMouseEnter={() => setHoveredButton('add-monthly')}
                onMouseLeave={() => setHoveredButton(null)}
                style={{
                  ...styles.button,
                  ...(hoveredButton === 'add-monthly' ? styles.buttonHover : {})
                }}
              >
                + Add Cost
              </button>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={{...styles.tableHeader, textAlign: 'left'}}>Category</th>
                    <th style={{...styles.tableHeader, textAlign: 'left'}}>Item</th>
                    <th style={{...styles.tableHeader, textAlign: 'right'}}>Monthly (€)</th>
                    <th style={{...styles.tableHeader, textAlign: 'right'}}>Annual (€)</th>
                    <th style={{...styles.tableHeader, textAlign: 'center'}}>Type</th>
                    <th style={{...styles.tableHeader, textAlign: 'left'}}>Notes</th>
                    <th style={styles.tableHeader}></th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyCosts.map((cost) => (
                    <tr key={cost.id}>
                      <td style={styles.tableCell}>
                        <input
                          type="text"
                          value={cost.category}
                          onChange={(e) => updateMonthlyCost(cost.id, 'category', e.target.value)}
                          style={styles.input}
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <input
                          type="text"
                          value={cost.item}
                          onChange={(e) => updateMonthlyCost(cost.id, 'item', e.target.value)}
                          style={styles.input}
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <input
                          type="number"
                          step="0.01"
                          value={cost.monthlyCost}
                          onChange={(e) => updateMonthlyCost(cost.id, 'monthlyCost', parseFloat(e.target.value) || 0)}
                          style={{...styles.inputSmall, width: '110px'}}
                        />
                      </td>
                      <td style={{...styles.tableCell, textAlign: 'right'}}>€{cost.annualCost.toFixed(2)}</td>
                      <td style={styles.tableCell}>
                        <select
                          value={cost.type}
                          onChange={(e) => updateMonthlyCost(cost.id, 'type', e.target.value)}
                          style={styles.select}
                        >
                          <option>Fixed</option>
                          <option>Variable</option>
                        </select>
                      </td>
                      <td style={styles.tableCell}>
                        <input
                          type="text"
                          value={cost.notes}
                          onChange={(e) => updateMonthlyCost(cost.id, 'notes', e.target.value)}
                          style={styles.input}
                        />
                      </td>
                      <td style={styles.tableCell}>
                        <button
                          onClick={() => deleteMonthlyCost(cost.id)}
                          style={styles.deleteButton}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr style={{backgroundColor: '#f5f5f5', fontWeight: 'bold'}}>
                    <td colSpan={2} style={{...styles.tableCell, textAlign: 'right'}}>TOTALS:</td>
                    <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                      €{totalMonthlyOpex.toFixed(2)}
                    </td>
                    <td style={{...styles.tableCell, textAlign: 'right', color: '#BB463C'}}>
                      €{(totalMonthlyOpex * 12).toFixed(2)}
                    </td>
                    <td colSpan={3} style={styles.tableCell}></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div style={styles.gridTwo}>
              <div style={{
                ...styles.infoBox,
                backgroundColor: '#e8f0f4',
                borderLeft: '4px solid #2F3E46'
              }}>
                <h3 style={{fontWeight: 'bold', color: '#2F3E46', marginBottom: '8px', fontSize: '16px'}}>Fixed Costs</h3>
                <p style={{fontSize: '24px', fontWeight: 'bold', color: '#2F3E46', margin: 0}}>
                  €{monthlyCosts.filter(c => c.type === 'Fixed').reduce((sum, c) => sum + c.monthlyCost, 0).toFixed(2)}
                </p>
                <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                  {monthlyCosts.filter(c => c.type === 'Fixed').length} items - Must pay regardless of sales
                </p>
              </div>
              <div style={{
                ...styles.infoBox,
                backgroundColor: '#e8f4f1',
                borderLeft: '4px solid #587C74'
              }}>
                <h3 style={{fontWeight: 'bold', color: '#587C74', marginBottom: '8px', fontSize: '16px'}}>Variable Costs</h3>
                <p style={{fontSize: '24px', fontWeight: 'bold', color: '#587C74', margin: 0}}>
                  €{monthlyCosts.filter(c => c.type === 'Variable').reduce((sum, c) => sum + c.monthlyCost, 0).toFixed(2)}
                </p>
                <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                  {monthlyCosts.filter(c => c.type === 'Variable').length} items - Scale with business activity
                </p>
              </div>
            </div>

            {/* Classic vs Pitmaster COGS Breakdown */}
            <div style={{...styles.sectionDivider}}>
              <h3 style={{fontSize: '18px', fontWeight: 'bold', color: '#2F3E46', marginBottom: '16px'}}>
                Cost of Goods Sold (COGS) by Category
              </h3>
              <div style={styles.gridTwo}>
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#ffe5e5',
                  borderLeft: '4px solid #BB463C',
                  margin: 0
                }}>
                  <h3 style={{fontWeight: 'bold', color: '#2F3E46', marginBottom: '8px', fontSize: '16px'}}>Classic COGS</h3>
                  <p style={{fontSize: '24px', fontWeight: 'bold', color: '#BB463C', margin: 0}}>
                    €{calculations.classicCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </p>
                  <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                    {calculations.classicUnits} units - {((calculations.classicCost / calculations.totalCost) * 100).toFixed(1)}% of total COGS
                  </p>
                </div>
                <div style={{
                  ...styles.infoBox,
                  backgroundColor: '#ffe5e5',
                  borderLeft: '4px solid #BB463C',
                  margin: 0
                }}>
                  <h3 style={{fontWeight: 'bold', color: '#587C74', marginBottom: '8px', fontSize: '16px'}}>Pitmaster COGS</h3>
                  <p style={{fontSize: '24px', fontWeight: 'bold', color: '#BB463C', margin: 0}}>
                    €{calculations.pitmasterCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                  </p>
                  <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                    {calculations.pitmasterUnits} units - {((calculations.pitmasterCost / calculations.totalCost) * 100).toFixed(1)}% of total COGS
                  </p>
                </div>
              </div>
            </div>

            <div style={{...styles.gridTwo, marginTop: '16px'}}>
              <div style={{
                ...styles.infoBox,
                backgroundColor: '#ffe5e5',
                borderLeft: '4px solid #BB463C'
              }}>
                <h3 style={{fontWeight: 'bold', color: '#BB463C', marginBottom: '8px', fontSize: '16px'}}>Total COGS</h3>
                <p style={{fontSize: '24px', fontWeight: 'bold', color: '#BB463C', margin: 0}}>
                  €{calculations.totalCost.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </p>
                <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                  Calculated from product sales volume (includes waste)
                </p>
              </div>
              <div style={{
                ...styles.infoBox,
                backgroundColor: '#e8f0f4',
                borderLeft: '4px solid #2F3E46'
              }}>
                <h3 style={{fontWeight: 'bold', color: '#2F3E46', marginBottom: '8px', fontSize: '16px'}}>Total Operating Expenses</h3>
                <p style={{fontSize: '24px', fontWeight: 'bold', color: '#2F3E46', margin: 0}}>
                  €{totalOperatingExpenses.toLocaleString('nl-NL', {minimumFractionDigits: 2})}
                </p>
                <p style={{fontSize: '14px', color: '#282828', marginTop: '4px'}}>
                  Monthly Opex (€{totalMonthlyOpex.toFixed(2)}) + COGS (€{calculations.totalCost.toFixed(2)})
                </p>
              </div>
            </div>
            
            <div style={{
              ...styles.infoBox,
              backgroundColor: '#fff3cd',
              borderLeft: '4px solid #BB463C',
              marginTop: '16px'
            }}>
              <p style={{color: '#282828', margin: 0, fontSize: '14px'}}>
                <strong>📦 Note:</strong> Total Operating Expenses includes both fixed costs (rent, labor, insurance) 
                and variable costs (COGS, packaging, cleaning supplies).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakEvenAnalysis;