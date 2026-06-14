import { Body, Container, Head, Heading, Html, Preview, Text, Section, Link } from "@react-email/components";
import * as React from "react";

export const InsightsEmail = ({ insights }) => (
  <Html>
    <Head />
    <Preview>Your Personalized Monthly Financial Insights are ready.</Preview>
    <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif", padding: "20px 0" }}>
      <Container style={{ backgroundColor: "#ffffff", padding: "40px", borderRadius: "8px", maxWidth: "600px", margin: "0 auto" }}>
        <Heading style={{ color: "#1a1a1a", fontSize: "24px", marginBottom: "20px" }}>
          📊 Monthly Financial Insights
        </Heading>
        <Text style={{ color: "#666", fontSize: "16px" }}>
          Here is a breakdown of your automated recommendations based on your spending habits this month:
        </Text>
        
        <Section style={{ margin: "24px 0" }}>
          {insights.map((insight, index) => (
            <div key={index} style={{ 
              padding: "16px", 
              borderRadius: "6px", 
              backgroundColor: insight.type === 'warning' ? '#fff5f5' : insight.type === 'success' ? '#f0fff4' : '#f7fafc',
              borderLeft: `4px solid ${insight.type === 'warning' ? '#e53e3e' : insight.type === 'success' ? '#38a169' : '#3182ce'}`,
              marginBottom: "16px"
            }}>
              <Text style={{ fontWeight: "bold", margin: "0 0 4px 0", color: "#2d3748" }}>
                {insight.type.toUpperCase()}: {insight.message}
              </Text>
              <Text style={{ margin: "0", color: "#4a5568", fontSize: "14px" }}>
                💡 <strong>Action Item:</strong> {insight.actionableStep}
              </Text>
            </div>
          ))}
        </Section>

        <Link href="https://yourdomain.com/dashboard" style={{ display: "inline-block", backgroundColor: "#4f46e5", color: "#fff", padding: "12px 24px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" }}>
          View Full Dashboard
        </Link>
      </Container>
    </Body>
  </Html>
);