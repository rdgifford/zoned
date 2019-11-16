import React from 'react';
import logo from './logo.svg';
import './App.css';

const states = [
  {
    'abbr': 'OR',
    'income_tax': .099,
    'property_tax': .014
  },
  {
    'abbr': 'UT',
    'income_tax': .0495,
    'property_tax': .0066
  },
  {
    'abbr': 'ID',
    'income_tax': .06925,
    'property_tax': .0075
  },
  {
    'abbr': 'NV',
    'income_tax': 0,
    'property_tax': .0069
  },
  {
    'abbr': 'CO',
    'income_tax': .0463,
    'property_tax': .0055
  },
  {
    'abbr': 'WA',
    'income_tax': 0,
    'property_tax': .0103
  },
  {
    'abbr': 'CA',
    // .123 for top tax bracket, but idk this seems more reasonable ($500k for top)
    'income_tax': .1,
    'property_tax': .0077
  }
]
const statesMap = states.reduce((prev, curr) => {
  prev[curr.abbr] = curr
  return prev
}, {})
console.log(statesMap)

// options: {key: string, value: string}[], onChange: string => void
const Select = ({ options, onChange }) => {
  return (
    <select onChange={ev => onChange(ev.target.value)}>
      <option value={''} key={-1}>{''}</option>
      {
        options.map(({ key, value }, i) => (
          <option value={value} key={i}>{key}</option>
        ))
      }
    </select>
  )
}
const calculateMortgage = (principal, percentageRate, lengthOfLoan) => {
  return (principal * percentageRate) / (1 - (Math.pow((1 + percentageRate) , lengthOfLoan * -1)));
}
const fin = n => +(n.toFixed(2))
const useMortgagePayments = (listPrice) => {
  let mortgagePayments = calculateMortgage(listPrice, .035 / 12, 30 * 12)
  // make sure to round to two places and return as number
  return fin(mortgagePayments);
}
const NumberInput = (props) => {
  const onChange = React.useCallback((ev) => {
      const int = parseInt(ev.target.value)
      props.onChange(int)
  })
  return <input onChange={onChange}/>
}
const App = () => {
  const [listPrice, setListPrice] = React.useState(NaN)
  const [projectedMonthlyRent, setProjectedMonthlyRent] = React.useState(NaN)
  const [usStateName, setUsStateName] = React.useState('')
  const mortgagePayments = useMortgagePayments(listPrice)

  const projectedIncome = projectedMonthlyRent*12
  const usState = statesMap[usStateName]

  const propertyTaxPercentage = usState ? usState.property_tax : NaN
  const propertyTax = fin(listPrice * propertyTaxPercentage)

  const incomeTaxPercentage = usState ? usState.income_tax : NaN
  const incomeTax = fin(projectedIncome * incomeTaxPercentage)

  // property tax and income tax based on dropdown
  // TODO(rdg) vacancy rate, repairs, and replacement reserve based on input fields with stored values
  const vacancyRatePercentage = .07
  const vacancyRate = fin(projectedIncome * vacancyRatePercentage)

  const repairsPercentage = .05
  const repairs = fin(projectedIncome * repairsPercentage)

  const replacementReservePercentage = .05
  const replacementReserve = fin(projectedIncome * replacementReservePercentage)

  const propertyInsurancePercentage = .005
  const propertyInsurance = fin(listPrice * propertyInsurancePercentage)
  
  const expenses = fin(incomeTaxPercentage + propertyTaxPercentage + propertyInsurance + vacancyRate + repairs + replacementReserve)
  const income = fin(projectedIncome - expenses)
  const downPayment = listPrice*.2
  const cashOnCash = fin(income / downPayment)

  const options = states.map(({ abbr }) => ({ key: abbr, value: abbr }))
  // TODO(rdg) put in a hook
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>list price</div>
        <NumberInput onChange={setListPrice} />
        <div>projected rent ($/month)</div>
        <NumberInput onChange={setProjectedMonthlyRent} />
        <Select
          options={options}
          onChange={setUsStateName}
        />
        <div>mortgage: {mortgagePayments}</div>
        <div>income tax (annual): {incomeTax} ({incomeTaxPercentage})</div>
        <div>property tax (annual): {propertyTax} ({propertyTaxPercentage})</div>
        <div>property insurance (annual): {propertyInsurance} ({propertyInsurancePercentage})</div>
        <div>vacancy rate (annual): {vacancyRate} ({vacancyRatePercentage})</div>
        <div>repairs (annual): {repairs} ({repairsPercentage})</div>
        <div>replacement reserve (annual): {replacementReserve} ({replacementReservePercentage})</div>
        <div>expenses (annual): {expenses}</div>
        <div>income (annual): {income}</div>
        <div>cash on cash (annual): {cashOnCash * 100}%</div>
      </div>
    );
}

export default App;
