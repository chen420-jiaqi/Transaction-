import { useState, useEffect } from "react";
import ReactTable from 'react-table';
import "./App.css";
import _ from 'lodash';

function fetchUser() {
  return Promise.resolve(
    [
      {
        custid: 1,
        name: "A",
        amt: 120,
        transactionDt: "05-01-2021"
      },
      {
        custid: 1,
        name: "A",
        amt: 70,
        transactionDt: "04-17-2021"
      },
      {
        custid: 1,
        name: "A",
        amt: 60,
        transactionDt: "02-21-2021"
      },
      {
        custid: 2,
        name: "B",
        amt: 10,
        transactionDt: "08-01-2021"
      },
      {
        custid: 2,
        name: "B",
        amt: 75,
        transactionDt: "06-21-2021"
      },
      {
        custid: 3,
        name: "C",
        amt: 200,
        transactionDt: "07-01-2021"
      },
      {
        custid: 3,
        name: "C",
        amt: 30,
        transactionDt: "07-04-2021"
      },
      {
        custid: 3,
        name: "C",
        amt: 80,
        transactionDt: "07-31-2021"
      },
      {
        custid: 4,
        name: "D",
        amt: 200,
        transactionDt: "07-21-2021"
      },
      {
        custid: 4,
        name: "D",
        amt: 120,
        transactionDt: "09-01-2021"
      }

    ]
  );
};

function calculateResults(userData) {
  // Calculate points per transaction

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const pointsPerTransaction = userData.map(transaction => {
    let points = 0;
    let overMore = transaction.amt - 100;

    if (overMore > 0) {
      points += (overMore * 2);
    }
    if (transaction.amt > 50) {
      points += 50;
    }
    const month = new Date(transaction.transactionDt).getMonth();
    return { ...transaction, points, month };
  });

  let customer = {};
  let totalPoints = {};
  pointsPerTransaction.forEach(pointsPerTransaction => {
    let { custid, name, month, points } = pointsPerTransaction;
    if (!customer[custid]) {
      customer[custid] = [];
    }
    if (!totalPoints[custid]) {
      totalPoints[name] = 0;
    }
    totalPoints[name] += points;
    if (customer[custid][month]) {
      customer[custid][month].points += points;
      customer[custid][month].monthNumber = month;
      customer[custid][month].numTransactions++;
    }
    else {

      customer[custid][month] = {
        custid,
        name,
        monthNumber: month,
        month: months[month],
        numTransactions: 1,
        points
      }
    }
  });
  let costall = [];
  for (var custKey in customer) {
    customer[custKey].forEach(cRow => {
      costall.push(cRow);
    });
  }
  console.log("customer", customer);
  console.log("tot", costall);
  let totByCustomer = [];
  for (custKey in totalPoints) {
    totByCustomer.push({
      name: custKey,
      points: totalPoints[custKey]
    });
  }
  return {
    summaryByCustomer: costall,
    pointsPerTransaction,
    totalPointsByCustomer: totByCustomer
  };
}

const App = () => {
  const [transactionData, setTransactionData] = useState(null);

  const columns = [
    {
      Header: 'Customer',
      accessor: 'name'
    },
    {
      Header: 'Month',
      accessor: 'month'
    },
    {
      Header: "# of Trans",
      accessor: 'numTransactions'
    },
    {
      Header: 'Reward Points',
      accessor: 'points'
    }
  ];
  const totalsColumns = [
    {
      Header: 'Customer',
      accessor: 'name'
    },
    {
      Header: 'Points',
      accessor: 'points'
    }
  ]

  function getIndividualTransactions(row) {
    let byCustMonth = _.filter(transactionData.pointsPerTransaction, (tRow) => {
      return row.original.custid === tRow.custid && row.original.monthNumber === tRow.month;
    });
    return byCustMonth;
  }

  useEffect(() => {
    fetchUser().then((data) => {
      const res = calculateResults(data);
      setTransactionData(res);
      console.log(res)
    })
      ;
  }, []);

  if (transactionData == null) {
    return <div>Loading...</div>;
  }

  return transactionData == null ?
    <div>Loading...</div>
    :
    <div>

      <div className="container">
        <div className="row">
          <div className="col-10">
            <h2>Points Rewards System Totals by Customer Months</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <ReactTable
              data={transactionData.summaryByCustomer}
              defaultPageSize={5}
              columns={columns}
              SubComponent={row => {
                return (
                  <div>

                    {getIndividualTransactions(row).map(tran => {
                      return <div className="container">
                        <div className="row">
                          <div className="col-8">
                            <strong>Transaction Date:</strong> {tran.transactionDt} - <strong>$</strong>{tran.amt} - <strong>Points: </strong>{tran.points}
                          </div>
                        </div>
                      </div>
                    })}

                  </div>
                )
              }}
            />
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-10">
            <h2>Points Rewards System Totals By Customer</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-8">
            <ReactTable
              data={transactionData.totalPointsByCustomer}
              columns={totalsColumns}
              defaultPageSize={5}
            />
          </div>
        </div>
      </div>
    </div>
    ;
}

export default App;
