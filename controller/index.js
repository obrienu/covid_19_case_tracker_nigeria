/* eslint-disable consistent-return */
const National = require('../model/national');
const State = require('../model/states');
const {
  cleanData,
  genNatData,
  generatePipeLine,
  generateNatPipeline,
} = require('../helper/generateData');
const {
  cummTotalpipeline,
  cummStatePipeline,
} = require('../helper/pipelines');


/* *****GET ROOT ROUTE******** */
exports.getRoot = (req, res) => {
  res.send('You have reached the Novel Covid 19 data API for Nigeria');
};

/* GET CUMMULATIVE OCCURENCE */
exports.getCummulativeData = async (req, res) => {
  try {
    const nationalCases = await National.aggregate(cummTotalpipeline);
    const cummulativeNat = await State.aggregate(cummStatePipeline);
    return res.send({
      nationalCases: nationalCases[0],
      states: cummulativeNat,
    });
  } catch (err) {
    console.error(`api, ${err}`);
    res.status(202).send({ err: err.message });
  }
};

/* *****GET NATIONAL DATA************ */
exports.getCummulativeNational = async (req, res) => {
  try {
    const pipeline = generateNatPipeline(req.query);
    const cases = await National.aggregate(pipeline);
    return res.send(cases);
  } catch (err) {
    console.error(`api, ${err}`);
    res.status(202).send({ err: err.message });
  }
};

/* *****GET STATE DATA************ */
exports.getByState = async (req, res) => {
  try {
    const pipeline = generatePipeLine(req.query, req.params);
    const cases = await State.aggregate(pipeline);
    return res.send(cases);
  } catch (err) {
    console.error(`api, ${err}`);
    res.status(202).send({ err: err.message });
  }
};

/* *****POST DATA************ */
exports.postData = async (req, res) => {
  const { date, states, summary } = cleanData(req.body);
  try {
    const natData = genNatData(summary, date);
    const newStates = await State.insertMany(states);
    const newNat = await new National(natData).save();
    res.status(200).send({
      national: newNat,
      reportedCasePerState: newStates,
    });
  } catch (err) {
    console.error(`api, ${err}`);
    res.status(404).send({ err: err.message });
  }
};
