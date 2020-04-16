exports.cummStatePipeline = [
  {
    $group: {
      _id: '$state',
      totalCases: {
        $sum: '$cases',
      },
    },
  },
  {
    $sort: { _id: 1 },
  },
];

exports.cummTotalpipeline = [
  {
    $group: {
      _id: null,
      totalCases: {
        $sum: '$cases',
      },
      totalDeaths: {
        $sum: '$deaths',
      },
      totalDischarged: {
        $sum: '$discharged',
      },
    },
  }, {
    $project: {
      _id: 0,
    },
  },
];
