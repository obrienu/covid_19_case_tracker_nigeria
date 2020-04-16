const currentlyInfected = (reportedCases) => {
    try {
      const obj = {};
      if (typeof reportedCases !== 'number') {
        throw new Error('Reported cases must be a number');
      } else {
        obj.impact = (reportedCases * 10);
        obj.severeImpact = (reportedCases * 50);
        return obj;
      }
    } catch (err) {
      return err;
    }
  };
  
  const projectedInfected = (infected, timeToElapse, periodType) => {
    try {
      if (timeToElapse === 0) return infected;
      let period;
      switch (periodType) {
        case 'days':
          period = timeToElapse;
          break;
        case 'week':
        case 'weeks':
          period = timeToElapse * 7;
          break;
        case 'month':
        case 'months':
          period = timeToElapse * 30;
          break;
        default:
          throw new Error('period Type should either be days, weeks, or months');
      }
      const factor = Math.trunc(period / 3);
      const projectedNumber = infected * (2 ** factor);
      return projectedNumber;
    } catch (err) {
      return err.message;
    }
  };
  
  const severeCases = (numOfEstInfections) => {
    const PERCENT = 15 / 100;
    return Math.trunc(numOfEstInfections * PERCENT);
  };
  
  const availableBed = (severeCasesByRequestedTime, totalHospitalBeds) => {
    const PERCENT = 35 / 100;
    const bedsAvailable = totalHospitalBeds * PERCENT;
    return Math.trunc(bedsAvailable) >= severeCasesByRequestedTime
      ? Math.trunc(bedsAvailable) : Math.trunc(bedsAvailable - severeCasesByRequestedTime);
  };
  
  const caseForICUAndVentilators = (severeCasesByRequestedTime) => {
    const ICUCases = Math.trunc((5 / 100) * severeCasesByRequestedTime);
    const ventilatorsCases = Math.trunc((2 / 100) * severeCasesByRequestedTime);
    return {
      ICUCases,
      ventilatorsCases
    };
  };
  
  const estimatedLoseInIncome = (infectionsByRequestedTime,
    timeToElapse, periodType, avgDailyIncomeInUSD, avgDailyIncomePopulation) => {
    let period;
    switch (periodType) {
      case 'day':
      case 'days':
        period = timeToElapse;
        break;
      case 'week':
      case 'weeks':
        period = timeToElapse * 7;
        break;
      case 'month':
      case 'months':
        period = timeToElapse * 30;
        break;
      default:
        period = timeToElapse;
    }
    const lose = (infectionsByRequestedTime
    * avgDailyIncomeInUSD * avgDailyIncomePopulation) / period;
    return Math.trunc(lose);
  };
  
  const impactEstimator = (data) => {
    const {
      periodType,
      timeToElapse,
      reportedCases,
      totalHospitalBeds,
      population,
      region: {
        avgDailyIncomeInUSD,
        avgDailyIncomePopulation
      }
    } = data;
  
    const { impact: currentlyInfectedPersons } = currentlyInfected(reportedCases, population);
    const infectionsByRequestedTime = projectedInfected(currentlyInfectedPersons,
      timeToElapse, periodType, population);
    const severeCasesByRequestedTime = severeCases(infectionsByRequestedTime);
    const hospitalBedsByRequestedTime = availableBed(severeCasesByRequestedTime,
      totalHospitalBeds);
    const { ICUCases, ventilatorsCases } = caseForICUAndVentilators(infectionsByRequestedTime);
    const dollarsInFlight = estimatedLoseInIncome(infectionsByRequestedTime,
      timeToElapse, periodType, avgDailyIncomeInUSD,
      avgDailyIncomePopulation);
    return ({
      currentlyInfected: currentlyInfectedPersons,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime: ICUCases,
      casesForVentilatorsByRequestedTime: ventilatorsCases,
      dollarsInFlight
    });
  };
  
  const severImpactEstimator = (data) => {
    const {
      periodType,
      timeToElapse,
      reportedCases,
      totalHospitalBeds,
      population,
      region: {
        avgDailyIncomeInUSD,
        avgDailyIncomePopulation
      }
    } = data;
    const { severeImpact: currentlyInfectedPersons } = currentlyInfected(reportedCases, population);
    const infectionsByRequestedTime = projectedInfected(currentlyInfectedPersons,
      timeToElapse, periodType, population);
    const severeCasesByRequestedTime = severeCases(infectionsByRequestedTime);
    const hospitalBedsByRequestedTime = availableBed(severeCasesByRequestedTime,
      totalHospitalBeds);
    const { ICUCases, ventilatorsCases } = caseForICUAndVentilators(infectionsByRequestedTime);
    const dollarsInFlight = estimatedLoseInIncome(infectionsByRequestedTime,
      timeToElapse, periodType, avgDailyIncomeInUSD,
      avgDailyIncomePopulation);
  
    return ({
      currentlyInfected: currentlyInfectedPersons,
      infectionsByRequestedTime,
      severeCasesByRequestedTime,
      hospitalBedsByRequestedTime,
      casesForICUByRequestedTime: ICUCases,
      casesForVentilatorsByRequestedTime: ventilatorsCases,
      dollarsInFlight
    });
  };
  
  const covid19ImpactEstimator = (data) => {
    const severeImpact = severImpactEstimator(data);
    const impact = impactEstimator(data);
    return ({
      data,
      impact,
      severeImpact
    });
  };
  
  module.exports = covid19ImpactEstimator;
  