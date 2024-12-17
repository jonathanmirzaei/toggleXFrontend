import { useEffect, useState } from "react";
import { fetchFeatureList } from "../../api-client";
import { Table, Progress, Switch, Tag, Space, Popconfirm, Input } from "antd"
import { deleteFeature, updateFeature } from "../../api-client";
//flag list
const FeatureList = ({ selectedProject, selectedEnvironment, setContentClick }) => {

   const [features, setFeatures] = useState([]);

   const addNew = (event) => {
      event.preventDefault();
      setContentClick("New Feature", "");
   };

   useEffect(() => {
      if (!selectedProject || !selectedEnvironment) {
         return
      }
      fetchFeatureList(selectedProject, selectedEnvironment).then((features) => {
         setFeatures(features);
      }).catch(console.error);
   }, [selectedProject, selectedEnvironment]);

   var experation_style = "green"

   function getExpeirationTagColor(date) {
      const experation_date = experationDate(date)

      if (experation_date > 10)
         experation_style = "green"
      else if (experation_date >= 5 && experation_date <= 10)
         experation_style = "blue"
      else if (experation_date < 5)
         experation_style = "red"

      return experation_style
   }

   function getExpeirationText(date) {
      return experationDate(date) >= 0 ? "in " + experationDate(date) + " days" : "Expired"
   }
   function experationDate(date) {
      const time_difrences = new Date(date).getTime() - new Date().getTime()
      return Math.round(time_difrences / (1000 * 3600 * 24));
   }

   const actionEdit = (event, feature) => {
      event.preventDefault();
      setContentClick("Edit Feature", feature);
   };

   const actionDelete = async (event, feature) => {
      event.preventDefault();
      try {
         await deleteFeature({ id: feature._id })
         setFeatures((prevFeatures) =>
            prevFeatures.filter((currFeature) => currFeature._id !== feature._id)
         )
      } catch (error) {
         console.error("Error deleting feature:", error);
      }
   }

   const updateState = async (event, feature, checked: boolean) => {
      // event.preventDefault();
      const { name, value } = event.target;
      console.log("name");
      console.log(name);
      console.log("value");
      console.log(value);
      // await updateFeature({
      //     name: feature.name,
      //     title: feature.title,
      //     description: feature.description,
      //     enable: checked,
      //     attribute_type: feature.attribute_type,
      //     attribute_value: feature.attribute_value,
      //     rules: feature.rules,
      //     percentage: feature.percentage,
      //     dependent: feature.dependent,
      //     end_date: feature.end_date,
      //     start_date: feature.start_date
      // })
   }

   const columns = [
      {
         title: 'Name',
         dataIndex: 'name',
         key: 'name',
      },
      {
         title: 'flag type',
         key: 'type',
         render: (text, record) =>
            <div>{record.attributes.type}</div>
      },
      {
         title: 'percentage',
         dataIndex: 'percentage',
         key: 'percentage',
         render: (text, record) => <div className="progress-group">
            <Progress
               percentPosition={{ align: 'center', type: 'inner' }}
               size={[100, 20]}
               strokeLinecap="butt"
               // steps={3}
               percent={text} />
            {/* </div> */}
         </div>
      },
      {
         title: 'Enable',
         dataIndex: 'enable',
         key: 'enable',
         render: (text, record) =>
            <Switch checked={text} onChange={(event) => updateState(event, record, text)} />,
      },
      {
         title: 'experation',
         dataIndex: 'experation',
         key: 'experation',
         render: (text, record) =>
            <Tag color={getExpeirationTagColor(record.end_date)}>{getExpeirationText(record.end_date)}</Tag>
      },
      {
         title: 'Actions',
         key: 'actions',
         render: (text, record) =>
            <Space size="middle">
               {/* <button className="btn nav-icon bi bi-pencil-square" onClick={(event) => actionEdit(event, record)}> Edit</button>
               <button className="btn nav-icon bi bi-trash" onClick={(event) => actionDelete(event, record)}> Delete</button> */}
                  <a className="nav-link bi bi-pencil-square" onClick={(event) => actionEdit(event, record)}></a>
               <Popconfirm title="Sure to delete?" onConfirm={(event) => actionDelete(event, record)}>
                  <a className="nav-link bi bi-trash"> </a>
               </Popconfirm>
               <Popconfirm title="Sure to promote?" onConfirm={(event) => actionDelete(event, record)}>
                  <a className="nav-link bi bi-arrow-up"> </a>
               </Popconfirm>
            </Space>
      },
   ];

   const [value, setValue] = useState('');
   const [originalFeatures, setOriginalFeatures] = useState(features); // Backup of the original data
   const [filteredFeatures, setFilteredFeatures] = useState(features); // Data for display (filtered or original)
   
   const onSearch = (event) => {
      const currValue = event.target.value;
      setValue(currValue);

      if (currValue === "") {
         // Restore the original list when input is cleared
         setFilteredFeatures(originalFeatures);
      } else {
         const filteredData = originalFeatures.filter(entry =>
            entry.name.includes(currValue)
         );
         setFilteredFeatures(filteredData);
      }
   }

   useEffect(() => {
      setOriginalFeatures(features); // Keep a copy of the original unfiltered list
      setFilteredFeatures(features); // Initialize the displayed list
   }, [features]); // Run this only when `features` changes
      
   const FilterByNameInput = (
      <Input
         placeholder="Search a flag"
         value={value}
         onChange={e => {
            onSearch(e)
         }}
      />
   );


   return (
      <div className="col-md-9">
         <div className="card mb-4">
            <div className="card-header">
               <div className="card-title">
                  {FilterByNameInput}
               </div>
               <button type="button" className="btn btn-outline-success breadcrumb float-sm-end" onClick={addNew}>Add new</button>
            </div>

            <div className="card-body table-responsive p-0"></div>
            <Table
               dataSource={filteredFeatures}
               columns={columns}
               rowKey={"_id"} />
         </div>
      </div>
   )
};

export default FeatureList;
