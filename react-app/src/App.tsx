import {
  Button,
  ExpandableTile,
  Form,
  Header,
  HeaderName,
  InlineNotification,
  Loading,
  TextInput,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
} from 'carbon-components-react';
import React, { useState } from 'react';

interface IResult {
  title: string;
  text: string;
  url: string;
  crawl_date: string;
}

const API_ENDPOINT = 'http://localhost:7000/api/query';

const App = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<IResult[]>([]);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    query: string
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const rawResponse = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      if (!rawResponse.ok) {
        setError(
          'Failed request. Please make sure the correct endpoint is set.'
        );
      } else {
        const response = await rawResponse.json();
        console.log(results);
        if (response.err) {
          setError(
            'There was a back-end error. Please make sure your Discovery credentials are correctly set.'
          );
        } else {
          setResults(response.results);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Failed request. Please make sure the correct endpoint is set.');
    }

    setIsLoading(false);
  };

  return (
    <>
      <Header aria-label='IBM Watson Discovery Demo'>
        <HeaderName href='#' prefix='IBM'>
          Watson Discovery Demo
        </HeaderName>
      </Header>
      <div
        className='bx--grid'
        style={{
          marginTop: '4rem',
        }}
      >
        <div className='bx--row'>
          <div className='bx--col-md-2'></div>
          <div className='bx--col-md-4'>
            <Form onSubmit={(e) => onSubmit(e, query)}>
              <div style={{ marginBottom: '2rem' }}>
                <TextInput
                  helperText='Your query will be sent to the Watson Discovery News collection'
                  id='query'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  labelText='Make a query'
                  placeholder='Your query'
                />
              </div>
              {error && (
                <InlineNotification
                  kind='error'
                  iconDescription='Close'
                  onCloseButtonClick={() => setError('')}
                  title={error}
                />
              )}
              <Button
                kind='primary'
                tabIndex={0}
                type='submit'
                disabled={isLoading}
              >
                Search
                {isLoading && (
                  <Loading
                    style={{ marginLeft: '1rem' }}
                    description='Loading...'
                    withOverlay={false}
                    small
                  />
                )}
              </Button>
            </Form>
          </div>
          <div className='bx--col-md-2'></div>
        </div>
        {results.length > 0 &&
          results.map((result, i) => (
            <div className='bx--row' style={{ marginTop: '2rem' }}>
              <div className='bx--col-md-2'></div>
              <div className='bx--col-md-4'>
                <ExpandableTile
                  tabIndex={i}
                  key={result.title}
                  tileCollapsedIconText='Expand'
                  tileExpandedIconText='Collapse'
                  tileMaxHeight={0}
                  tilePadding={0}
                >
                  <TileAboveTheFoldContent>
                    <div>
                      <h3>{result.title}</h3>
                      <p style={{ fontSize: '0.8rem', fontWeight: 300 }}>
                        {result.crawl_date.slice(0, 10)}
                      </p>
                    </div>
                  </TileAboveTheFoldContent>
                  <TileBelowTheFoldContent>
                    <div>
                      <p style={{ marginTop: '1rem' }}>{result.text}</p>
                      <p style={{ marginTop: '0.5rem' }}>
                        From: <a href={result.url}>{result.url}</a>
                      </p>
                    </div>
                  </TileBelowTheFoldContent>
                </ExpandableTile>
              </div>
              <div className='bx--col-md-2'></div>
            </div>
          ))}
      </div>
    </>
  );
};

export default App;
