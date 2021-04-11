import React from "react";
import axios from "axios";

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
    axios
      .get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd")
      .then((resp) => {
        this.setState({ coins: resp.data, loading: false });
        console.log(resp.data);
      });
  }

  calculateTotalHoldings = (key, val) => {
    let newTotalHoldings = this.state.totalHoldings;
    newTotalHoldings +=
      this.state.coins.find((coin) => coin.name == key).current_price * val;
    this.setState({ totalHoldings: newTotalHoldings });
  };

  render() {
    if (this.state.loading) return <div>loading...</div>;

    if (!this.state.coins.length) return <div>no coin found</div>;

    return (
      <div>
        <div>
          {this.state.coins
            .filter((coin) => coin.market_cap_rank <= 10)
            .map((coin) => (
              <div key={coin.id}>
                {coin.market_cap_rank}-
                <img src={coin.image} height="20px" />-{coin.name}-{coin.symbol}
                -{coin.current_price}
              </div>
            ))}
        </div>
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
