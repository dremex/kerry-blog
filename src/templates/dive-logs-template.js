import React from 'react';
import moment from 'moment';
import Page from '../components/Page';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';

import { graphql } from 'gatsby';

const DiveLogTemplate = ({ data }) => {
  const siteTitle = `Dive Log for "${data.markdownRemark.frontmatter.location.name}, ${data.markdownRemark.frontmatter.location.place}"`
  const pageTitle = `${data.markdownRemark.frontmatter.location.name}, ${data.markdownRemark.frontmatter.location.place}`
  const visibility = data.markdownRemark.frontmatter.conditions.visibility ? `${data.markdownRemark.frontmatter.conditions.visibility} feet` : 'N/A'

  const {
      html: pageBody
    } = data.markdownRemark;

  return (
    <Layout title={`${siteTitle} - ${data.site.siteMetadata.title}`} description={data.site.siteMetadata.subtitle}>
      <Sidebar />
      <Page>
        <h2>{pageTitle}</h2>
        <h4 class="dive-log-date">{moment(data.markdownRemark.frontmatter.date).format('MMMM Do, YYYY')}</h4>

        <div class="dive-log-wrapper">
            <div class="dive-log-box">
                <span class="dive-log-box-header">Dive Number</span>
                {data.markdownRemark.frontmatter.diveNumber}
            </div>
            <div class="dive-log-box">
                <span class="dive-log-box-header">Dive Buddy</span>
                {data.markdownRemark.frontmatter.buddy}
            </div>
        </div>

        <div class="dive-log-wrapper">
            <div class="dive-log-box">
                <span class="dive-log-box-header">Bottom Time</span>
                {data.markdownRemark.frontmatter.profile.bottomTime} min
            </div>
            <div class="dive-log-box">
                <span class="dive-log-box-header">Max Depth</span>
                {data.markdownRemark.frontmatter.profile.depth.max} feet
            </div>
            <div class="dive-log-box">
                <span class="dive-log-box-header">Average Depth</span>
                N/A
            </div>
        </div>

        <div class="dive-log-wrapper">
            <div class="dive-log-box">
                <span class="dive-log-box-header">Water</span>
                {data.markdownRemark.frontmatter.conditions.water.type} - {data.markdownRemark.frontmatter.conditions.water.temperature}&deg;
            </div>
            <div class="dive-log-box">
                <span class="dive-log-box-header">Visibility</span>
                {visibility}
            </div>
            <div class="dive-log-box">
                <span class="dive-log-box-header">Day/Night</span>
                {data.markdownRemark.frontmatter.conditions.dayOrNight}
            </div>
        </div>

        <div class="dive-log-wrapper">
            <div class="dive-log-box">
                <span class="dive-log-box-header">Hood</span>
                {data.markdownRemark.frontmatter.equipment.exposure.hood}
            </div>
            <div class="dive-log-box">
                <span class="dive-log-box-header">Gloves</span>
                {data.markdownRemark.frontmatter.equipment.exposure.gloves}
            </div>
            <div class="dive-log-box">
                <span class="dive-log-box-header">Wetsuit</span>
                {data.markdownRemark.frontmatter.equipment.exposure.wetsuit}
            </div>
        </div>

        <div class="dive-log-wrapper">
            <div class="dive-log-box">
                <span class="dive-log-box-header">Weight</span>
                {data.markdownRemark.frontmatter.equipment.weight} lbs
            </div>
            <div class="dive-log-box">
                <span class="dive-log-box-header">Gas</span>
                {data.markdownRemark.frontmatter.equipment.gas}
            </div>
        </div>

        <div class="dive-log-comments-wrapper" dangerouslySetInnerHTML={{ __html: pageBody }} />
      </Page>
    </Layout>
  );
};

export const query = graphql`
  query DiveLogBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        subtitle
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date
        buddy
        diveNumber
        location {
            name
            place
        }
        profile {
            bottomTime
            depth {
              max
            }
          }
        conditions {
            water {
                type
                temperature
            }
            surface {
                type
                temperature
            }
            visibility
            dayOrNight
        }
        equipment {
            tank {
                type
            }
            weight
            gas
            exposure {
                hood
                gloves
                wetsuit
            }
        }
      }
    }
  }
`;

export default DiveLogTemplate;
