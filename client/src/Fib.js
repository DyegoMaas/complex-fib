import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndices: [],
        values: {},
        index: ''
    };

    componentDidMount() {
        this.fetchValues();
        this.fetchIndices();
    }

    async fetchValues() {
        const values = await axios.get('/api/values/current');
        this.setState({
            values: values.data
        });
    }

    async fetchIndices() {
        const indices = await axios.get('/api/values/all');
        this.setState({
            seenIndices: indices.data
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        });
        this.setState({ index: '' });
    }

    renderSeenIndices() {
        return this.state.seenIndices.map(({ number }) => number).join(', ');
    }

    renderSeenValues() {
        const entries = [];

        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]}
                </div>
            );
        }

        return entries;
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button type="submit">Submit</button>
                </form>

                <h3>Indices I have seen:</h3>
                { this.renderSeenIndices() }

                <br/>

                <h3>Calculated values:</h3>
                { this.renderSeenValues() }
            </div>
        )
    }
}

export default Fib;