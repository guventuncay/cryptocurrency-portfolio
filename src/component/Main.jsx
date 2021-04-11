import React from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import NumberFormat from "react-number-format";
import "bootstrap-icons/font/bootstrap-icons.css";
export default class Main extends React.Component {
  state = {
    coins: [],
    loading: true,
    selected: "",
    assets: [],
    newAsset: "",
    totalHoldings: 0,
  };

  async componentDidMount() {
    this.getMarket();
  }

  //I'll update that later on
  // setTimeout(this.getMarket.bind(this), 5000);
  calculateTotalHoldings = (key, val) => {
    let newTotalHoldings = this.state.totalHoldings;
    newTotalHoldings +=
      this.state.coins.find((coin) => coin.name === key).current_price * val;
    this.setState({ totalHoldings: newTotalHoldings });
  };

  getMarket() {
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
      .then((resp) => {
        this.setState({ coins: resp.data, loading: false });
        console.log(resp.data);
      });
  }

  render() {
    if (this.state.loading) return <div>loading...</div>;

    if (!this.state.coins.length) return <div>no coin found</div>;

    return (
      <div>
        <table className="table table-bordered border-primary">
          <thead>
            <tr>
              <td>#</td>
              <td>Name</td>
              <td>Current Price</td>
              <td width="100px">24h %</td>
              <td>Market Cap</td>
              <td>Volume(24h)</td>
              <td>Circulating Supply</td>
            </tr>
          </thead>
          <tbody>
            {this.state.coins
              .filter((coin) => coin.market_cap_rank <= 10)
              .map((coin) => (
                <tr key={coin.id}>
                  <td>{coin.market_cap_rank}</td>
                  <td>
                    <img src={coin.image} alt="symbol" height="20px" />
                    <span> {coin.name}</span>
                    <span style={{ color: "grey" }}>
                      {" " + coin.symbol.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <NumberFormat
                      value={coin.current_price}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </td>
                  {coin.price_change_percentage_24h < 0 ? (
                    <td style={{ color: "red" }}>
                      <i className="bi bi-caret-down-fill"></i>
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </td>
                  ) : (
                    <td style={{ color: "green" }}>
                      <i className="bi bi-caret-up-fill"></i>
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </td>
                  )}
                  <td>
                    <NumberFormat
                      value={coin.market_cap}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </td>
                  <td>
                    <NumberFormat
                      value={coin.total_volume}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  </td>
                  <td>
                    <NumberFormat
                      value={coin.circulating_supply}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={" BTC"}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div>
          Add crypto:
          <select
            value={this.state.selected}
            onChange={(event) =>
              this.setState({ selected: event.target.value })
            }
          >
            {this.state.coins
              .filter((coin) => coin.market_cap_rank <= 10)
              .map((coin) => (
                <option key={coin.market_cap_rank} value={coin.name}>
                  {coin.name}
                </option>
              ))}
          </select>
          Value:
          <input
            placeholder="Enter value"
            value={this.state.newAsset}
            onChange={(event) =>
              this.setState({ newAsset: event.target.value })
            }
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              let key = this.state.selected;
              let val = this.state.newAsset;
              let newAssets = this.state.assets;
              newAssets.push({ key, val });
              this.setState({ assets: newAssets });
              console.log(this.state.assets);
              this.calculateTotalHoldings(key, val);
            }}
          >
            Submit
          </button>
        </div>
        <div>Total holdings in USD: {this.state.totalHoldings}$</div>
        <div>
          {this.state.assets.map((x) => (
            <div>
              {x.key},{x.val}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
