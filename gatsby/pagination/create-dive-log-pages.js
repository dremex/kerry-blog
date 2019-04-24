'use strict';

const _ = require('lodash');
const path = require('path');

module.exports = async (graphql, actions) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      allMarkdownRemark(
        filter: { frontmatter: { template: { eq: "diveLog" }, draft: { ne: true } } }
      ) {
        group(field: frontmatter___location___place) {
          fieldValue
          totalCount
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
    }
  `);

  _.each(result.data.allMarkdownRemark.group, (diveLog) => {
    const diveLogSlug = `/dive-logs/${_.kebabCase(diveLog.fieldValue)}`;

    for (let i = 0; i < diveLog.totalCount; i += 1) {
        const latLngPairs = _.reduce(diveLog.edges, function(result, value) {
          if (!_.some(result, value.node.frontmatter.location)) {
            result.push(value.node.frontmatter.location)
          }
          return result;
        }, []);

      createPage({
        path: i === 0 ? diveLogSlug : `${diveLogSlug}/page/${i}`,
        component: path.resolve('./src/templates/dive-logs-place-template.js'),
        context: {
          diveLogPlace: diveLog.fieldValue,
          diveLogLatLngPairs: latLngPairs
        }
      });
    }
  });
};
