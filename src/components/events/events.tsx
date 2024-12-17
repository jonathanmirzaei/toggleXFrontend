import { useEffect, useState } from "react";
import { fetchTotalActiveUsers, fetchEvents, fetchAllFeatureList } from "../../api-client.ts";
import { Button, Col, Row, Statistic, Table } from 'antd';
import React from "react";

const Events = ({ selectedProject }) => {
   const [features, setFeatures] = useState([]);
   const [totalActiveUsers, setTotalActiveUsers] = useState([]);
   const [events, setEvents] = useState([]);
   const [selectedFeatuerName, setSelectedFeatureName] = useState("");
   const [selectedFeatuer, setSelectedFeature] = useState("");

   const handleFeatureSelection = (event) => {
      event.preventDefault();
      const { value } = event.target;
      console.log("value");
      console.log(value);
      setSelectedFeatureName(value);
      setSelectedFeature(features.filter((feature) => feature.name === value))
      // console.log("selectedFeatuer.Variations");
      // console.log(selectedFeatuer[0].variations);
   };

   const fetchFeatures = async (project: string) => {
      try {
         await fetchAllFeatureList(project, "production")
            .then((features) => {
               setFeatures(features);
               var name = (features.length > 0) ? features[0].name : ""
               setSelectedFeatureName(name);
               setSelectedFeature(features.filter((feature) => feature.name === name))

            })
            .catch(console.error);
      } catch (error) {
         console.error("Error fetching features:", error);
      }
   };

   useEffect(() => {
      fetchFeatures(selectedProject);
      fetchTotalActiveUsers(selectedProject)
         .then((totalActiveUsers) => setTotalActiveUsers(totalActiveUsers))
         .catch(console.error);
   }, [selectedProject]);

   useEffect(() => {
      fetchEvents(selectedProject, selectedFeatuerName)
         .then((events) => setEvents(events))
         .catch(console.error);
   }, [selectedProject, selectedFeatuerName]);

   // **Metric Calculations**
   const getStatusCheckVolume = (events) => events.filter((event) => event.event === "StatusCheck").length;
   const getValueCheckVolume = (events) => events.filter((event) => event.event === "valueCheck").length;
   const getActiveVolume = (events) => events.filter((event) => event.status === true).length;
   const getInactiveVolume = (events) => events.filter((event) => event.status === false).length;

   // const getVariationStatistics = (events) => {
   //    const variationEvents = events.filter((event) => event.type === "exp");
      
   //    const variationStats = variationEvents.reduce((acc, event) => {
   //       if (!acc[event.variation]) {
   //          acc[event.variation] = { count: 0, name: event.variation };
   //       }
   //       acc[event.variation].count += 1;
   //       return acc;
   //    }, {});

   //    const totalCount = variationEvents.length;
   //    return Object.values(variationStats).map((stat) => ({
   //       ...stat,
   //       percentage: ((stat.count / totalCount) * 100).toFixed(2),
   //    }));
   // };
   const getVariationStatistics = (events: any[]) => {
      const variationEvents = events.filter((event) => event.type === "exp" && event.event === "valueCheck");
      
      // Define the structure of the statistics object
      const variationStats: Record<string, { count: number; name: string }> = {};
   
      variationEvents.forEach((event) => {
         if (!event.variation) return; // Skip if variation is undefined
         if (!variationStats[event.variation]) {
            variationStats[event.variation] = { count: 0, name: event.variation };
         }
         variationStats[event.variation].count += 1;
      });
   
      const totalCount = variationEvents.length;
   
      // Map the statistics to include percentage
      return Object.values(variationStats).map((stat) => ({
         ...stat,
         percentage: totalCount > 0 ? ((stat.count / totalCount) * 100).toFixed(2) : "0.00",
      }));
   };
   
   const getToggleUsagePerUser = (events) => {
      const userEvents = events.reduce((acc, event) => {
         acc[event.userId] = (acc[event.userId] || 0) + 1;
         return acc;
      }, {});
      return (Object.keys(userEvents).length > 0)
         ? (events.length / Object.keys(userEvents).length).toFixed(2)
         : 0;
   };

   const getPeakActivityHour = (events) => {
      const hours = events.reduce((acc, event) => {
         const hour = new Date(event.date).getHours();
         acc[hour] = (acc[hour] || 0) + 1;
         return acc;
      }, {});
      const peakHour = Object.keys(hours).reduce((a, b) => (hours[a] > hours[b] ? a : b), 0);
      return `${peakHour}:00-${peakHour}:59`;
   };
   const variationStats = getVariationStatistics(events);

   return (
      <>
         <div className="col-md-9">
            <div className="card mb-4">
               <div className="card-header">
                  <h3 className="card-title">Project: {selectedProject}</h3>
               </div>
               <div className="card-body">
                  <select id="condition" className="form-control dropdown-toggle" onChange={handleFeatureSelection}>
                     {features.map((feature, index) => (
                        <option key={index} className="dropdown-item" value={feature.name}>{feature.name}</option>
                     ))}
                  </select>
                  <Table
                     dataSource={selectedFeatuer}
                     columns={[
                        { title: "name", dataIndex: "name", key: "name" },
                        { title: "Percentage", dataIndex: "percentage", key: "percentage" },
                        { title: "Enable", dataIndex: "enable", key: "enable" },
                     ]}
                     rowKey="name"
                     pagination={false}
                  />
                   <Table
                     dataSource={selectedFeatuer[0]? selectedFeatuer[0].variations : []}
                     columns={[
                        { title: "name", dataIndex: "name", key: "name" },
                        { title: "Percentage", dataIndex: "percentage", key: "percentage" },
                     ]}
                     rowKey="name"
                     pagination={false}
                  />
                  <Row gutter={8}>
                     <Col span={4}>
                        <Statistic title="Total Unique Users" value={totalActiveUsers.length} />
                     </Col>
                     <Col span={4}>
                        <Statistic title="Feature Hits" value={events.length} />
                     </Col>
                     <Col span={4}>
                        <Statistic title="Active For" value={getActiveVolume(events)} />
                     </Col>
                     <Col span={4}>
                        <Statistic title="Inactive For" value={getInactiveVolume(events)} />
                     </Col>
                     <Col span={4}>
                        <Statistic title="Check Status" value={getStatusCheckVolume(events)} />
                     </Col>
                     <Col span={4}>
                        <Statistic title="Get Value" value={getValueCheckVolume(events)} />
                     </Col>
                     <Col span={4}>
                        <Statistic title="Toggle Usage/User" value={getToggleUsagePerUser(events)} />
                     </Col>
                     <Col span={4}>
                        <Statistic title="Peak Activity Hour" value={getPeakActivityHour(events)} />
                     </Col>
                  </Row>

                  {/* Experiment Variation Statistics */}
                  {variationStats.length > 0 && (
                     <div style={{ marginTop: 20 }}>
                        <h4>Experiment Variations</h4>
                        <Table
                           dataSource={variationStats}
                           columns={[
                              { title: "Variation Name", dataIndex: "name", key: "name" },
                              { title: "Count", dataIndex: "count", key: "count" },
                              { title: "Percentage", dataIndex: "percentage", key: "percentage" },
                           ]}
                           rowKey="name"
                           pagination={false}
                        />
                     </div>
                  )}
               </div>
            </div>
         </div>
      </>
   );
};

export default Events;
