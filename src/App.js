import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

// const isSearched = (searchTerm) => (item) =>
//   !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

  constructor(props){
    super(props);

    this.state = {
      searchTerm: DEFAULT_QUERY,
      results: null,
      searchKey: '',
    };

    this.needsToSearchTopstories = this.needsToSearchTopstories.bind(this);
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
  }

  needsToSearchTopstories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  onSearchSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.needsToSearchTopstories(searchTerm)) {
      this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    }

    event.preventDefault();
  }

  setSearchTopstories(results) {
    const { hits, page } = results;
    const { searchKey } = this.state;

    const oldHits = results && results[searchKey]
      ? this.state.result.hits
      : [];
    const updatedHits = [
        ...oldHits,
        ...hits
    ];

    this.setState({
        results: {
          ...results,
          [searchKey]: { hits: updatedHits, page }
        }
    });
  }

  fetchSearchTopstories(searchTerm, page) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(results => this.setSearchTopstories(results))
      .catch(e => e);
    console.log(this.state);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm, DEFAULT_PAGE);
    this.setState({ searchKey: searchTerm });
  }

  onDismiss(id){
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      ...results,
      [searchKey]: { hits: updatedHits, page }
    });
  }

  onSearchChange(event){
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { searchTerm, results, searchKey } = this.state;
    const page = (results && results[searchKey] && results[searchKey].hits) || 0;
    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className={"page"}>
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
          Search
        </Search>
        { results &&
          <Table
            list={list}
            onDismiss={this.onDismiss}
          />
        }
        <div className={"interactions"}>
          <Button onClick={() => this.fetchSearchTopstories(searchKey, page + 1)}>
            More
          </Button>
        </div>
      </div>
    );
  }
}

const Search = ({ value, onChange, children, onSubmit }) =>
  (
    <form onSubmit={onSubmit}>
      <input
        type={"text"}
        value={value}
        onChange={onChange}
      />
      <button type={"submit"}>
        {children}
      </button>
    </form>
  );

const Table = ({list, onDismiss}) =>
  <div className={"table"}>
    { list.map(
        item =>
          <div key={item.objectID} className={"table-row"}>
            <span style={{ width: "40%"}}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: "30%"}}>{item.author}</span>
            <span style={{ width: "10%"}}>{item.num_comments}</span>
            <span style={{ width: "10%"}}>{item.points}</span>
            <span style={{ width: "10%"}}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className={"button-inline"}
              >
                Dismiss
              </Button>
            </span>
          </div>
      )
    }
  </div>;

const Button = ({onClick, className ='', children}) =>
      <button
        onClick={onClick}
        className={className}
        type={"button"}
      >
        {children}
      </button>;


export default App;
