import React from 'react';
import moment from 'moment';
import Page from '../components/Page';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

import { Link, graphql } from 'gatsby';
import { getLatLngPairs } from '../utils';

const DiveLogsPlaceTemplate = ({ data, pageContext }) => {
  const { edges } = data.allMarkdownRemark;
  const { diveLogPlace, diveLogLatLngPairs } = pageContext;
  const pageTitle = `Dive Logs for "${diveLogPlace}" - ${data.site.siteMetadata.title}`;

  return (
    <Layout title={pageTitle} description={data.site.siteMetadata.subtitle}>
      <Sidebar />
      <Page title={diveLogPlace}>
        <img src={`https://maps.googleapis.com/maps/api/staticmap?${getLatLngPairs(diveLogLatLngPairs)}&size=600x275&maptype=terrain&key=AIzaSyBgt9m466yuFoT1XjLyzMVwoKwNPUVDLsI`} />
        <ul>
            {edges.map((diveLog) => (
                <li key={diveLog.node.frontmatter.diveNumber}>
                <Link to={`/dive-log/${diveLog.node.frontmatter.diveNumber}/`}>
                    {diveLog.node.frontmatter.location.name} ({moment(diveLog.node.frontmatter.date).format('MMMM D, YYYY')})
                </Link>
                </li>
            ))}
            </ul>
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query DiveLogsPlacePage($diveLogPlace: String) {
    site {
      siteMetadata {
        title
        subtitle
      }
    }
    allMarkdownRemark(
        filter: { frontmatter: { location: { place: { eq: $diveLogPlace } }, template: { eq: "diveLog" } } },
        sort: { order: ASC, fields: [frontmatter___date] }
      ){
      edges {
        node {
          frontmatter {
            date
            diveNumber
            location {
                name
                latitude
                longitude
            }
          }
        }
      }
    }
  }
`;

export default DiveLogsPlaceTemplate;
