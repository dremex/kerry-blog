import React from 'react';
import Page from '../components/Page';
import kebabCase from 'lodash/kebabCase';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

import { Link, graphql } from 'gatsby';
import { getLatLngPairs } from '../utils';

const _ = require('lodash');

const DiveLogsListTemplate = ({ data }) => {
  const {
    title,
    subtitle
  } = data.site.siteMetadata;
  const { group } = data.allMarkdownRemark;

  const latLngPairs = _.reduce(data.allMarkdownRemark.edges, function(result, value) {
    if (!_.some(result, value.node.frontmatter.location)) {
      result.push(value.node.frontmatter.location)
    }
    return result;
  }, []);

  return (
    <Layout title={`Dive Logs - ${title}`} description={subtitle}>
      <Sidebar />
      <Page title="Dive Logs">
        <img src={`https://maps.googleapis.com/maps/api/staticmap?${getLatLngPairs(latLngPairs)}&size=600x275&maptype=terrain&key=AIzaSyBgt9m466yuFoT1XjLyzMVwoKwNPUVDLsI`} />
        <ul>
          {group.map((divelog) => (
            <li key={divelog.fieldValue}>
              <Link to={`/dive-logs/${kebabCase(divelog.fieldValue)}/`}>
                {divelog.fieldValue} ({divelog.totalCount})
              </Link>
            </li>
          ))}
        </ul>
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query DiveLogsListQuery {
    site {
      siteMetadata {
        title,
        subtitle
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { template: { eq: "diveLog" } } }
    ) {
      group(field: frontmatter___location___place) {
        fieldValue
        totalCount
      }
      edges {
        node {
          frontmatter {
            location {
                latitude
                longitude
            }
          }
        }
      }
    }
  }
`;

export default DiveLogsListTemplate;