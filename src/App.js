import React, {useEffect, useState} from 'react';
import './App.scss';
import {ApolloClient, InMemoryCache, ApolloProvider, gql, createHttpLink} from '@apollo/client';
import {setContext} from "@apollo/client/link/context";
import {
  LineChart,
  PieChart,
  Pie,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxisProps,
    PolarRadiusAxisProps,
  Label,
  PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import {Grid} from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


function App({ moduleData }) {
  const [aliens, setAliens] = useState(null);
  const [planets, setPlanets] = useState(null);

  const httpLink = createHttpLink({
    uri: 'https://young-caverns-56729.herokuapp.com/https://api.hubapi.com/collector/graphql',
  })


  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = 'pat-na1-dda6dff1-97f1-45d9-b24a-33643458c9ae';
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      }
    }
  });

  useEffect(()=>{

    const client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    })

    const data = client.query({
      query: gql`
      {
  CRM {
    p_planet_collection(limit: 100, orderBy: yearsofexperience__desc, filter: {yearsofexperience__null: false}) {
      items {
        yearsofexperience
        name
        color
        atmosphere
      }
    }
  }
}
    `
    }).then((result)=>{console.log(result.data.CRM.p_planet_collection.items); setPlanets(result.data.CRM.p_planet_collection.items)})


    const aliens = client.query({
      query: gql`
      {
  CRM {
    p_alien_collection(orderBy: hs_createdate__desc, limit: 10) {
      items {
        name
        planet
        profile_image_url
        experience
        hs_object_id
        alien_job
      }
    }
  }
}
      `
    }).then((result)=>{console.log(result.data.CRM.p_alien_collection.items); setAliens(result.data.CRM.p_alien_collection.items)})

  },[])


  // eslint-disable-next-line no-console
  console.log(
    'all of your data typically accessed via the "module" keyword in HubL is available as JSON here!',
    moduleData,
  );

  const columns = [
    {field: 'hs_object_id', headerName: "ID", width: 20 },
    {field: 'profile_image_url', headerName: "Picture", width: 50},
  {field: 'name', headerName: "Name", width: 100},
    {field: 'experience', headerName: 'Lightyears of Experience', width: 50}
  ];


  console.log(planets)
  return (
    <div className="cms-react-boilerplate__container" style={{"margin-top" : "50px"}}>
      <Grid container spacing={2}>
        <Grid md={12} className={"navMenu"}>
          Spaceport 75
        </Grid>
        <Grid xs>
          {planets && aliens ?
              <div style={{"height" : "100%", "width" : "50%"}}>
                <ComposedChart width={730} height={250} data={planets}>
                  <XAxis dataKey={"name"}/>
                  <YAxis/>
                  <Legend formatter={(value, entry, index) => <span className="text-color-class">Lightyears of Experience</span>}/>
                  <Tooltip/>
                  <CartesianGrid stroke="#f5f5f5"/>
                  <Bar dataKey={"yearsofexperience"} barSize={20} fill="green"/>
                </ComposedChart>
              </div>
              :
          <Grid xs>
              <p className={"loadingBlock"}>
                🪐 Intergalactic Planetary 🪐
              </p>
            <p className={"loadingBlock"}>Roger. This is LD. We will hold at minus five minutes waiting for the latest computation from space shuttle launch.
            </p>
          </Grid>
          }
        </Grid>
        {aliens ?
          <Grid xs={6}>
            <TableContainer>
              <Table sx={{minWidth: 500}} size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Profile Picture
                    </TableCell>
                    <TableCell>
                      Name
                    </TableCell>
                    <TableCell>
                      Home Planet
                    </TableCell>
                    <TableCell>
                      Lightyears of Experience
                    </TableCell>
                    <TableCell>
                      Alien Job
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                  {aliens.map((row)=>(
                      <TableRow
                          key={row.name}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          hover
                      >
                        <TableCell component="th" scope="row" className={"alienFace"}>
                          <img src={row.profile_image_url} alt={row.name} style={{ "max-width": "30px"}}/>
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                       <TableCell align="center">{row.planet ? row.planet.label : 'No Home'}</TableCell>
                        <TableCell align="center">{row.experience}</TableCell>
                        <TableCell align="center">{row.alien_job ? row.alien_job.label : 'No Job'}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          :

            <Grid xs>
              <p className={"loadingBlock"}>
                👽 Spaceport 75 👽
              </p>
              <p className={"loadingBlock"}>All systems are go. Blast off.
              </p>
            </Grid>
        }
        {aliens ?
            <Grid xs>
              <RadarChart outerRadius={90} width={730} height={250} data={planets}>
                <PolarGrid/>
                <PolarAngleAxis dataKey="name"/>
                <PolarRadiusAxis angle={30} domain={[0,20]}/>
                <Radar name="Experience" dataKey="yearsofexperience" stroke="#7118C4" fill="#6CC417" fillOpacity={0.6}/>
                <Legend wrapperStyle={{position: 'relative', marginTop: '10px'}} />
              </RadarChart>
            </Grid>
            : null
        }
      </Grid>

    </div>
  );
}

export default App;
