// Editorial summaries of the supplied CV (July 22, 2026) and dated field notes.
// Attendance is based only on entries naming Satheesh. See docs/content-provenance.md.
const caddo = { name: 'Caddo Research Station', region: 'caddo' };
const mmr = { name: 'Altus · cotton monitoring site', region: 'altus' };
const swrec = { name: 'SWREC', region: 'altus' };
const pan = (name) => ({ name, region: 'panhandle' });
export const trips = [
  {
    date: '2026-06-15',
    title: 'The first sensors go in.',
    category: 'INSTALLATION / COTTON',
    sites: [caddo, mmr],
    image: 'crs-installation',
    caption: 'Caddo Research Station · June 15, 2026',
    summary:
      'At Caddo and the Altus cotton site, our team installed canopy-temperature sensors, rain gauges, and data loggers. I worked on sensor connections and testing, helping establish the measurements we would follow through the cotton season.',
  },
  {
    date: '2026-06-30',
    title: 'From field sensors to a grower’s screen.',
    category: 'INSTALLATION + GROWER ENGAGEMENT',
    sites: [caddo, mmr],
    image: 'muller-field',
    caption: 'Altus cotton field · June 30, 2026',
    summary:
      'We installed soil-moisture probes, corrected sensor alignment, and investigated logger issues. At the Altus cotton site, I demonstrated OASIS—from account creation to adding a field—and explained how the measurements connect to irrigation decisions.',
  },
  {
    date: '2026-07-08',
    title: 'Making the measurements reliable.',
    category: 'SENSOR TROUBLESHOOTING',
    sites: [caddo, mmr],
    image: 'season-2026-07-08',
    caption: 'Caddo Research Station · July 8, 2026',
    summary:
      'We verified the corrected timestamps and rain-gauge data at Caddo. At the Altus cotton site, we replaced a logger that intermittently failed to recognize sensors. I also helped the grower’s team access measurements and set up their field in OASIS.',
  },
  {
    date: '2026-07-10',
    title: 'Four stops. A wider field perspective.',
    category: 'PANHANDLE / SENSOR INSTALLATION',
    sites: [
      pan('Sorghum site 1 · sorghum'),
      pan('Sorghum site 2 · sorghum'),
      pan('Sunflower site · sunflower'),
      pan('OPREC · soybean'),
    ],
    image: 'panhandle-sorghum',
    caption: 'Panhandle sorghum field · July 10, 2026',
    summary:
      'Across three grower fields, I helped install rain gauges and ZL6 loggers, tested communication, and measured plant height and canopy cover. At OPREC, our team cleared weeds around the sensors and collected monitoring data.',
  },
  {
    date: '2026-07-20',
    title: 'Building a three-site cotton network.',
    category: 'INSTALLATION + MONITORING',
    sites: [swrec, mmr, caddo],
    image: 'altus-installation',
    caption: 'SWREC sensor installation · July 20, 2026',
    summary:
      'We installed the SWREC canopy-sensing setup and soil-moisture sensors at four depths. I connected the IRT sensors to the CR1000 logger. The day also included checks, crop measurements, and sensor maintenance at the Altus cotton site and Caddo.',
  },
  {
    date: '2026-07-30',
    title: 'Following a growing canopy.',
    category: 'CROP MEASUREMENTS / COTTON',
    sites: [swrec, mmr, caddo],
    image: 'season-2026-07-30',
    caption: 'Caddo Research Station · July 30, 2026',
    summary:
      'We collected sensor data, measured plant height and canopy cover, and maintained the cotton monitoring sites. Flowers and developing bolls marked the progression of the season. We also discussed irrigation records with the grower at the Altus cotton site.',
  },
  {
    date: '2026-08-05',
    title: 'Keeping the network in the field.',
    category: 'PANHANDLE / MAINTENANCE',
    sites: [
      pan('Corn site 1 · corn'),
      pan('OPREC · soybean'),
      pan('Corn site 2 · corn'),
      pan('Sunflower site · sunflower'),
      pan('Corn site 3 · corn'),
      pan('Corn site 4 · corn'),
    ],
    image: 'panhandle-august-05',
    caption: 'Panhandle corn field · August 5, 2026',
    summary:
      'Six site visits focused on practical reliability: replacing a damaged rain gauge, reconnecting a soil-moisture sensor at OPREC, collecting data, and clearing pollen from gauges. We also reinstalled equipment found lying on the ground at the sunflower site.',
  },
  {
    date: '2026-08-12',
    title: 'The details that protect the data.',
    category: 'DATA COLLECTION + MAINTENANCE',
    sites: [caddo, mmr, swrec],
    image: 'season-2026-08-12',
    caption: 'Caddo Research Station · August 12, 2026',
    summary:
      'We downloaded canopy-temperature and soil-moisture records, cleaned sensor lenses, and recorded crop measurements. At Caddo, we repaired and secured a disconnected battery lead before collecting the logger data.',
  },
  {
    date: '2026-08-14',
    title: 'Six fields, one careful routine.',
    category: 'PANHANDLE / MONITORING',
    sites: [
      pan('Corn site 5 · corn'),
      pan('Sorghum site 1 · sorghum'),
      pan('Corn site 6 · corn'),
      pan('Sorghum site 2 · sorghum'),
      pan('Corn site 7 · corn'),
      pan('Silage corn site · silage corn'),
    ],
    image: 'panhandle-august-14',
    caption: 'Panhandle silage corn field · August 14, 2026',
    summary:
      'We visited six corn and sorghum fields to download data, inspect wiring, clean rain gauges, and verify their response with manual tipping tests. Each stop included a check of field conditions and photographs of the monitoring equipment.',
  },
  {
    date: '2026-08-19',
    title: 'Checking the late-season signal.',
    category: 'COTTON / SENSOR MONITORING',
    sites: [caddo, mmr, swrec],
    image: 'season-2026-08-19',
    caption: 'Caddo Research Station · August 19, 2026',
    summary:
      'Across the cotton sites, we collected logger data, cleaned equipment, and measured crop height and canopy cover. At Caddo, a spider web in the rain gauge prompted cleaning and a manual check; at SWREC, we adjusted the canopy sensor height.',
  },
  {
    date: '2026-08-21',
    title: 'Closing the loop in the field.',
    category: 'PANHANDLE / EQUIPMENT RECOVERY',
    sites: [pan('Corn site 8 · corn'), pan('Sorghum site 1 · sorghum')],
    image: 'panhandle-august-21',
    caption: 'Panhandle equipment recovery · August 21, 2026',
    summary:
      'At the harvested corn site, we investigated missing sensor data after harvest, documented damaged equipment, and recovered it. We then carefully removed the monitoring equipment from the sorghum site.',
  },
];
// Region and capture date travel together; never reuse another region's photograph.
export function tripPhoto(trip, region) {
  if (region === 'caddo')
    return { image: `season-${trip.date}`, caption: 'Caddo Research Station' };
  if (region === 'altus')
    return { image: `altus-${trip.date}`, caption: 'Altus cotton monitoring site' };
  return { image: trip.image, caption: trip.caption.split(' · ')[0] };
}
export const seasonDates = [
  '2026-06-15',
  '2026-06-30',
  '2026-07-08',
  '2026-07-20',
  '2026-07-30',
  '2026-08-12',
  '2026-08-19',
];
export const projects = {
  canopy: {
    category: 'RESEARCH / CANOPY TEMPERATURE',
    title: 'Listening to the canopy.',
    problem:
      'As cotton grows, a fixed sensor’s view changes. Regularly adjusting sensor height adds field labor and complicates long-term monitoring.',
    contribution:
      'I developed and evaluated OLS, Random Forest, and LightGBM approaches using sensor measurements and weather variables to estimate height-adjusted canopy temperature.',
    outcome:
      'The CV reports a 53% reduction in early-season measurement error with OLS and an RMSE of 1.52 °C for the canopy-temperature work. These results describe the evaluated conditions, rather than performance across every crop or climate.',
    tools: ['Python', 'OLS', 'Random Forest', 'LightGBM', 'Mesonet'],
    link: 'https://doi.org/10.1109/DCAS69364.2026.11545108',
    linkLabel: 'Read the conference paper',
    source: 'Source: supplied CV, July 22, 2026; IEEE DCAS conference paper listed in the CV.',
  },
  humidity: {
    category: 'ONGOING RESEARCH / CLIMATE + IRRIGATION',
    title: 'When humidity changes the story.',
    problem:
      'Canopy temperature reflects both crop water status and the surrounding atmosphere. Relative humidity can limit how readily a temperature signal translates into an irrigation decision.',
    contribution:
      'I am investigating humidity constraints on canopy-temperature-based scheduling across climatic gradients in the 17-state U.S. Cotton Belt, connecting crop-temperature research with weather data analysis.',
    outcome:
      'The work is ongoing. Its purpose is to clarify where atmospheric conditions affect interpretation of canopy-temperature measurements and the decisions drawn from them.',
    tools: ['Weather data', 'Relative humidity', 'Canopy temperature', 'Python'],
    link: '#fieldwork',
    linkLabel: 'Explore the fieldwork',
    source: 'Source: supplied July 2026 CV and its ASABE conference contributions.',
  },
  openet: {
    category: 'ONGOING RESEARCH / GEOSPATIAL ANALYTICS',
    title: 'A wider view of water.',
    problem:
      'Estimating irrigation requirements over large areas requires consistent information about water use, vegetation, and weather.',
    contribution:
      'I extracted evapotranspiration raster data through Google Earth Engine and integrated ET, NDVI, precipitation, and reference ET variables. The CV describes this analysis across five U.S. states.',
    outcome:
      'The ongoing seasonal-irrigation framework connects OpenET products and environmental variables to support regional irrigation estimation.',
    tools: ['OpenET', 'Google Earth Engine', 'Raster analysis', 'ET / ETo', 'NDVI'],
    link: '#publications',
    linkLabel: 'See research contributions',
    source: 'Source: supplied CV, July 22, 2026.',
  },
  medical: {
    category: 'SOFTWARE / NATURAL LANGUAGE PROCESSING',
    title: 'Medi-Text Summarizer',
    problem:
      'Medical research papers and clinical notes contain dense information that can be difficult to navigate quickly.',
    contribution:
      'I built a summarization application using PubMedBERT, DistilBERT, and LLaMA-3.2, with named entity recognition, question answering, and multilingual support through the Google Cloud Translation API.',
    outcome:
      'A Streamlit application that brings summarization and exploration into one interface.',
    tools: ['PubMedBERT', 'DistilBERT', 'LLaMA-3.2', 'Streamlit'],
    link: 'https://github.com/SATHEESH-MEADI/Medical-Text-Analysis-System',
    linkLabel: 'View source on GitHub',
    source: 'Source: CV, July 22, 2026.',
  },
  finance: {
    category: 'SOFTWARE / DATA ENGINEERING',
    title: 'Financial Risk Pipeline',
    problem:
      'Market and portfolio analysis needs reliable ingestion, consistent storage, and repeatable reporting.',
    contribution:
      'I engineered ingestion into PostgreSQL and Snowflake, implemented CAPM-based risk analysis, and built portfolio dashboards. Airflow retries and Kubernetes orchestration supported the pipeline’s reliability.',
    outcome:
      'An integrated workflow for asset performance, risk ratios, and Sharpe metrics, combining data engineering with an analytical interface.',
    tools: ['Python', 'Airflow', 'Snowflake', 'PostgreSQL', 'Kubernetes'],
    link: 'https://github.com/SATHEESH-MEADI/Real_Time_Financial_Risk_Dashboard',
    linkLabel: 'View source on GitHub',
    source: 'Source: CV, July 22, 2026.',
  },
  nba: {
    category: 'SOFTWARE / PREDICTIVE ANALYTICS',
    title: 'Dribble, Predict, Win',
    problem:
      'Sports forecasting requires integrating historical patterns with changing player and team performance.',
    contribution:
      'I built PySpark pipelines for live and historical feeds, used player and team statistics to forecast NBA outcomes, and added model drift monitoring.',
    outcome:
      'A forecasting project working with more than 10,000 historical records, as described in the CV.',
    tools: ['PySpark', 'Feature engineering', 'Machine learning', 'Drift monitoring'],
    link: 'https://github.com/SATHEESH-MEADI/NBA-Game-Forecast',
    linkLabel: 'View source on GitHub',
    source: 'Source: CV, July 22, 2026.',
  },
};
