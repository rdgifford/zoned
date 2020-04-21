import React from 'react';
import styled from 'styled-components'
import Cleave from 'cleave.js/react'

const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number) => {
  let timeout: any

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => resolve(func(...args)), waitFor)
    })
}

const RowCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`
const ColumnCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
`
const SColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const RowRight = styled.div`
  display: flex;
  justify-content: flex-end;
`
const InputContainer = styled.div`
  display: flex;
  padding: 5px;
`
const STable = styled.table`
  width: 100%;
`
const percent = (n: number) => (n*100).toFixed(2) + "%"
const dollars = (n: number) => "$" + n.toFixed(2)
const SimpleTable = ({ matrix }: any) => {
  return (
    // TODO(rdg) this width isn't appearing set from either styled or the style prop
    <STable>
      <tbody>
        {
          matrix.map((row: any, i: any) => (
            <tr key={i}>
            {
              row.map((val: any, j: any) => {
                return (<td key={`${i} ${j}`}>{val}</td>)
              })
            }
            </tr>
          ))
        }
      </tbody>
    </STable>
  )
}

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
const statesMap = states.reduce((prev: any, curr: any) => {
  prev[curr.abbr] = curr
  return prev
}, {})
console.log(statesMap)

// options: {key: string, value: string}[], onChange: string => void
const Select = ({ options, onChange }: any) => {
  return (
    <select onChange={ev => onChange(ev.target.value)}>
      <option value={''} key={-1}>{''}</option>
      {
        options.map(({ key, value }: any, i: number) => (
          <option value={value} key={i}>{key}</option>
        ))
      }
    </select>
  )
}
const calculateMortgage = (principal: any, percentageRate: any, lengthOfLoan: any) => {
  return (principal * percentageRate) / (1 - (Math.pow((1 + percentageRate) , lengthOfLoan * -1)));
}
const fin = (n: number) => +(n.toFixed(2))
const NumberInput = (props: any) => {
  return (
    <Cleave 
      options={{
        numeral: true,
        numeralThousandsGroupStyle: 'thousand'
      }}
      onChange={ev => props.onChange(ev, ev.target.rawValue)}
    />
  )
}
const PercentInput = (props: any) => {
  return (
    <Cleave 
      options={{
        numeral: true,
        numeralDecimalScale: 4,
        numeralPositiveOnly: true,
        numeralThousandsGroupStyle: 'none',
      }}
      className={props.className}
      value={props.value}
      onChange={(ev: any) => {
        if (props.className === ev.currentTarget.className) {
          props.onChange(ev, ev.currentTarget.value)
        }
        ev.stopPropagation();
      }}
    />
  )
}
const App = () => {
  const [listPrice, setListPrice] = React.useState(NaN)
  const [projectedMonthlyRent, setProjectedMonthlyRent] = React.useState(NaN)
  const [usStateName, setUsStateName] = React.useState('')
  // 3.5 percent default
  const [annualMortgageInterestRate, setAnnualMortgageInterestRate] = React.useState(.035)
  // 20 percent downpayment
  const [downpaymentPercentage, setDownpaymentPercentage] = React.useState(.20);

  const downpayment = listPrice*downpaymentPercentage
  const mortgageLengthYears = 30
  const mortgagePayments = fin(calculateMortgage(listPrice - downpayment, annualMortgageInterestRate / 12, mortgageLengthYears * 12))
  const mortgage = mortgagePayments * 12

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
  
  const operatingExpenses = fin(incomeTax + propertyTax + propertyInsurance + vacancyRate + repairs + replacementReserve)
  const netExpenses = operatingExpenses + mortgage
  const income = fin(projectedIncome - netExpenses)
  const cashOnCash = fin(income / downpayment)

  const debouncedSetAnnualMortgageInterestRate = React.useMemo(() => debounce(setAnnualMortgageInterestRate, 200), [setAnnualMortgageInterestRate])
  const options = states.map(({ abbr }) => ({ key: abbr, value: abbr }))
  // TODO(rdg) put in a hook
    return (
      <div className="App">
        <RowRight>
          <SColumn>
            <InputContainer>
              {"list price: "}
              <NumberInput onChange={(_: any, v: any) => setListPrice(v)} />
            </InputContainer>
            <InputContainer>
              {"projected rent ($/month): "}
              <NumberInput onChange={(_: any, v: any) => setProjectedMonthlyRent(v)} />
            </InputContainer>
            <InputContainer>
              {"state: "}
              <Select
                options={options}
                onChange={setUsStateName}
              />
            </InputContainer>
          </SColumn>
        </RowRight>
        <br/>
        <RowCenter>
          <ColumnCenter>
            <div>Figures are annual unless otherwise noted.</div>
            <br />
            <SimpleTable matrix={[
              ['monthly mortgage payment: ', dollars(mortgagePayments), <PercentInput className='month' value={annualMortgageInterestRate/12} onChange={(_: any, v: any) => {
                debouncedSetAnnualMortgageInterestRate(v*12)
              }}/>],
              ['mortgage: ', dollars(mortgage), <PercentInput className='year' value={annualMortgageInterestRate} onChange={(_: any, v: any) => {
                debouncedSetAnnualMortgageInterestRate(v)
              }}/>],
              ['downpayment: ', dollars(downpayment), <PercentInput className='downpayment' value={downpaymentPercentage} onChange={(_: any, v: any) => {
                setDownpaymentPercentage(v)
              }}/>],
              ['-', '-', '-'],
              ['income tax: ', dollars(incomeTax), percent(incomeTaxPercentage)],
              ['property tax: ', dollars(propertyTax), percent(propertyTaxPercentage)],
              ['property insurance: ', dollars(propertyInsurance), percent(propertyInsurancePercentage)],
              ['vacancy rate: ', dollars(vacancyRate), percent(vacancyRatePercentage)],
              ['repairs: ', dollars(repairs), percent(repairsPercentage)],
              ['replacement reserve: ', dollars(replacementReserve), percent(replacementReservePercentage)],
              ['operating expenses: ', dollars(operatingExpenses), undefined],
              ['-', '-', '-'],
              ['net monthly expenses: ', dollars(netExpenses / 12), undefined],
              ['net expenses: ', dollars(netExpenses), undefined],
              ['income: ', dollars(income), undefined],
              ['cash on cash: ', undefined, percent(cashOnCash)]
            ]} />
          </ColumnCenter>
        </RowCenter>
      </div>
    );
}

export default App;
