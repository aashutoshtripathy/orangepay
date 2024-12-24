import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CRow, CCol, CCardHeader, CContainer, CForm, CFormCheck, CFormInput, CButton } from '@coreui/react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Permission = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    topup: false,
    billPayment: false,
    requestCancellation: false,
    getPrepaidBalance: false,
    fundRequest: false,
  });

  const [fundRequestMethods, setFundRequestMethods] = useState({
    bankTransfer: false,
    upi: false,
    cash: false,
    cdm: false,
  });

  const [billPaymentMethods, setBillPaymentMethods] = useState({
    wallet: false,
    ezetap: false,
    upiQr: false,
    rrn: false,
  });


  const [discom, setDiscom] = useState({
    nbpdcl: false,
    sbpdcl: false,
  });

  const [commission, setCommission] = useState(''); // State for commission

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //   const userId = localStorage.getItem('userId');
  const naviagte = useNavigate();
  const { userId } = useParams(); // Get userId from URL using useParams





  const southBiharDivision = {
    "ASHIYANA": {
      ASHIYANA: ["ASHIYANA"],
      KHAJPURA: ["IGIMS", "KHAJPURA", "VIJAYNAGAR"],
    },
    "PATNACITY": {
      CHOWK: ["CHOWK", "East Muzaffarpur", "West Muzaffarpur"],
      KATRA: ["Sitamarhi Sadar", "Pupri"],
      MAHRUFGANJ: ["Sheohar Sadar"],
    },
    "BANKIPUR": {
      BANKIPUR: ["BANKIPUR(1)", "BANKIPUR(2)"],
      UNIVERSITY: ["PMCH", "UNIVERSITY"],
    },
    "RAJENDRANAGAR": {
      RAJENDRANAGAR: ["RAJENDRA NAGAR", "SAIDPUR", "Biraul"],
      MACHHUATOLI: ["M.TOLI", "M.PUR", "Benipatti"],
    },
    "KANKARBAGH(1)": {
      KARBIGAHIYA: ["KARBIGAHIYA(E)", "KARBIGAHIYA(W)", "ASHOK NAGAR"],
      BAHADURPUR: ["BAHADURPUR", "KUMHRAR"],
      KANKARBAGH: ["KANKARBAGH(E)", "KANKARBAGH(W)", "HANUMANNAGAR"],
    },
    "KANKARBAGH(2)": {
      GOPALPUR: ["NAYA CHAK", "KHEMNI CHAK(W)", "Dhamdaha"],
      RKNAGAR: ["KHEMNICHAK", "R.K.NAGAR"],
    },
    "GULZARBAGH": {
      GAIGHAT: ["PATHAR KI MASJID", "GAIGHAT", "Naugachhia"],
      MEENABAZAR: ["MEENABAZAR(1)", "MEENABAZAR(2)"],
    },
    "NEW CAPITAL": {
      NEWCAPITAL: ["NEW CAPITAL", "BUDHA COLONY", "MLA FLAT"],
      BOARDCOLONY: ["BOARD COLONY", "RAJABAZAAR"],
      KHAJPURA: ["NO SUBDEVISION"],
    },
    "PATLIPUTRA": {
      SADAKATASHRAM: ["SADAKAT ASHRAM", "RAJAPUR"],
      PATLIPUTRA: ["P.P.COLONY", "INDUSTRIAL AREA"],
      SKPURI: ["S.K.PURI", "A.N.COLLEGE"],
    },
    "DAKBUNGLOW": {
      MAURYALOK: ["MAURYA LOK", "STATION ROAD"],
      KADAMKUAN: ["KADAMKUAN", "EXHIBITION ROAD"],
    },
    "GARDANIBAGH": {
      GARDANIBAGH: ["GARDANIBAGH", "ANISABAD", "BEUR"],
      JAKKANPUR: ["JAKKANPUR", "MITHAPUR"],
    },
    "DANAPUR": {
      DANAPUR: ["DANAPUR", "MES", "ANAND BAZAR"],
      DIGHA: ["DIGHA", "GOLA ROAD"],
    },
    "BIHTA": {
      BIHTA: ["BIHTA(1)", "BIHTA(2)", "PAREO"],
      MANER: ["MANER", "SHERPUR"],
      BIKRAM: ["BIKRAM", "LALA BHADSARA"],
      PALIGANJ: ["PALI", "MAHABALIPUR"],
    },
    "BARH": {
      BARH: ["BARH TOWN", "BARH(R)", "PANDARAK"],
      BAKHTIYARPUR: ["BAKHTIYARPUR(U)", "BAKHTIYARPUR(R)", "ATHMALGOLA"],
      MOKAMA: ["MOKAMA TOWN", "MOKAMA(R)", "GOSHWARI"],
      Jamui: ["Jamui Sadar", "Jhajha", "Sono"],
      Khagaria: ["Khagaria Sadar", "Gogri"],
      Begusarai: ["Begusarai Sadar", "Bachhwara", "Bakhri"],
    },
    "FATUHA": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "MASAURHI": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "PATNA": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "ARRAH": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BUXAR": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BIHARSARIF": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "RAJGIR": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "EKANGARSARAI": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "NAWADA": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "SASARAM": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "DEHRIONSONE": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BHABUA": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BHOJPUR": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/fetchUserList/${userId}`);
        const result = response.data.fetchUser || {};

        // Map the API response to checkbox states
        setSelectedOptions({
          topup: result.topup || false,
          billPayment: result.billPayment || false,
          requestCancellation: result.requestCancellation || false,
          getPrepaidBalance: result.getPrepaidBalance || false,
          fundRequest: result.fundRequest || false,
        });

        setFundRequestMethods({
          bankTransfer: result.bankTransfer || false,
          upi: result.upi || false,
          cash: result.cash || false,
          cdm: result.cdm || false,
        });

        setBillPaymentMethods({
          wallet: result.wallet || false,
          ezetap: result.ezetap || false,
          upiQr: result.upiQr || false,
          rrn: result.rrn || false,
        });


        const discomData = {};

      // Loop through discomFields and check if they are true in the result
      const discomFields = [
        'nbpdcl', 'sbpdcl', 'ASHIYANA', 'PATNACITY', 'BANKIPUR', 'RAJENDRANAGAR', 
        'KANKARBAGH1', 'KANKARBAGH2', 'GULZARBAGH', 'NEWCAPITAL', 'PATLIPUTRA', 
        'DAKBUNGLOW', 'GARDANIBAGH', 'DANAPUR', 'BIHTA', 'BARH', 'FATUHA', 
        'MASAURHI', 'PATNA', 'ARRAH', 'BUXAR', 'BIHARSARIF', 'RAJGIR', 'EKANGARSARAI', 
        'NAWADA', 'SASARAM', 'DEHRIONSONE', 'BHABUA', 'BHOJPUR'
      ];

      discomFields.forEach(field => {
        if (result[field] === true) {
          discomData[field] = true;
        }
      });

      // Set the discom state with the populated discomData object
      setDiscom(discomData);


        setCommission(result.margin || '0');
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCommissionChange = (e) => {
    setCommission(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setSelectedOptions({
      ...selectedOptions,
      [e.target.name]: e.target.checked,
    });
  };



  const handleMethodChange = (e, methodType , divisionName) => {
    if (methodType === 'fundRequest') {
      setFundRequestMethods({
        ...fundRequestMethods,
        [e.target.name]: e.target.checked,
      });
    } else if (methodType === 'billPayment') {
      setBillPaymentMethods({
        ...billPaymentMethods,
        [e.target.name]: e.target.checked,
      });
    } else if (methodType === 'discom') {
      setDiscom({
        ...discom,
        [e.target.name]: e.target.checked,
      });
    }else if (methodType === 'division') {
      setDiscom({
        ...discom,
        [divisionName]: e.target.checked,
        // If the division is unchecked, uncheck all its subdivisions as well
        ...(e.target.checked ? {} : Object.keys(southBiharDivision[divisionName]).reduce((acc, sub) => {
          acc[sub] = false;
          return acc;
        }, {}))
      });
    } 
  };




  const handleUpdate = async () => {
    // const { userId } = useParams();

    try {
      const updateData = {
        ...selectedOptions,
        ...fundRequestMethods,
        ...billPaymentMethods,
        ...discom,
      };
      const response = await axios.put(`/api/v1/users/updateUserPermissions/${userId}`, updateData);

      if (response.data.success) {
        console.log('Permissions updated successfully:', response.data.updatedUser);
        naviagte(`/view-user`)
        // You might want to show a success message or update the UI accordingly
      } else {
        console.error('Update failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const handleUpdateCommission = async () => {
    // Prepare the data to be sent to the backend for commission only
    const updatedData = { commission };

    try {
      const response = await axios.put(`/api/v1/users/updateCommission/${userId}`, updatedData);

      if (response.data.success) {
        console.log('Commission updated successfully:', response.data.updatedUser);
        naviagte(`/view-user`);
      } else {
        console.error('Commission update failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating commission:', error);
    }
  };

  return (
    <CContainer fluid>

      <CCard className="mb-4">


        <CCardHeader><h5>Update Options</h5></CCardHeader>
        <CCardBody>
          <CForm>
            {/* Checkbox Group */}
            <CFormCheck
              id="topup"
              name="topup"
              label="TopUp"
              checked={selectedOptions.topup}
              onChange={handleCheckboxChange}
            />
            <CFormCheck
              id="billPayment"
              name="billPayment"
              label="Bill Payment"
              checked={selectedOptions.billPayment}
              onChange={handleCheckboxChange}
            />
            <CFormCheck
              id="getPrepaidBalance"
              name="getPrepaidBalance"
              label="Prepaid Balance"
              checked={selectedOptions.getPrepaidBalance}
              onChange={handleCheckboxChange}
            />
            <CFormCheck
              id="requestCancellation"
              name="requestCancellation"
              label="Request Cancellation"
              checked={selectedOptions.requestCancellation}
              onChange={handleCheckboxChange}
            />
            <CFormCheck
              id="fundRequest"
              name="fundRequest"
              label="Fund Request"
              checked={selectedOptions.fundRequest}
              onChange={handleCheckboxChange}
            />

            {/* Update Button */}
            {/* <CButton color="primary" onClick={handleUpdate}>
            Update
          </CButton> */}
          </CForm>


          <hr />

          <h5>Fund Request Method</h5>
          <CForm>

            <CFormCheck
              id="bankTransfer"
              name="bankTransfer"
              label="Bank Transfer"
              checked={fundRequestMethods.bankTransfer}
              onChange={(e) => handleMethodChange(e, 'fundRequest')}
            />
            <CFormCheck
              id="upi"
              name="upi"
              label="Upi"
              checked={fundRequestMethods.upi}
              onChange={(e) => handleMethodChange(e, 'fundRequest')}
            />
            <CFormCheck
              id="cash"
              name="cash"
              label="Cash"
              checked={fundRequestMethods.cash}
              onChange={(e) => handleMethodChange(e, 'fundRequest')}
            />
            <CFormCheck
              id="cdm"
              name="cdm"
              label="Cdm"
              checked={fundRequestMethods.cdm}
              onChange={(e) => handleMethodChange(e, 'fundRequest')}
            />
            {/* <CButton color="primary" onClick={handleUpdate}>
            Update
          </CButton> */}

            {/* Bill Payment Method */}
            <hr />
            <h5>Bill Payment Method</h5>
            <CFormCheck
              id="wallet"
              name="wallet"
              label="Wallet"
              checked={billPaymentMethods.wallet}
              onChange={(e) => handleMethodChange(e, 'billPayment')}
            />
            <CFormCheck
              id="ezetap"
              name="ezetap"
              label="Ezetap"
              checked={billPaymentMethods.ezetap}
              onChange={(e) => handleMethodChange(e, 'billPayment')}
            />
            <CFormCheck
              id="upiQr"
              name="upiQr"
              label="UPI-QR"
              checked={billPaymentMethods.upiQr}
              onChange={(e) => handleMethodChange(e, 'billPayment')}
            />
            <CFormCheck
              id="rrn"
              name="rrn"
              label="RRN"
              checked={billPaymentMethods.rrn}
              onChange={(e) => handleMethodChange(e, 'billPayment')}
            />


            <hr />

            <h5>Discom</h5>
<CRow>
<React.Fragment key="southBiharDivision">
  {/* Box for Division */}
  <CCol md={3} className="mx-3 border p-3 rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <h6>All Divisions</h6>
            {Object.entries(southBiharDivision).map(([division, subdivisions]) => (
              <div key={division} style={{ marginBottom: '1rem' }}>
                <CFormCheck
                  id={division.toLowerCase().replace(/\s+/g, '_')}
                  name={division.toLowerCase().replace(/\s+/g, '_')}
                  label={division}
                  checked={discom[division] || false}  // Check the box if the division is set to true in discom
                  onChange={(e) => handleMethodChange(e, 'division', division)}
                />
            {/* If there are subdivisions, display them */}
            {/* {Object.values(subdivisions || {}).flat().map((subdivision) => (
              <div key={subdivision} style={{ marginLeft: '20px' }}>
                <CFormCheck
                  id={subdivision.toLowerCase().replace(/\s+/g, '_')}
                  name={subdivision.toLowerCase().replace(/\s+/g, '_')}
                  label={subdivision}
                  checked={discom[subdivision] || false}  // Check the box if the subdivision is set to true in discom
                  onChange={(e) => handleMethodChange(e, 'subdivision')}
                />
              </div>
            ))} */}
          </div>
        ))}
      </CCol>

                  {/* Box for Sub-Division */}
                  {/* <CCol md={3} className="border p-3 rounded" style={{ maxHeight: '300px', overflowY: 'auto' }}>
  <h6>All Sub-Divisions</h6>
  {Object.entries(southBiharDivision).map(([division, subdivisions]) => (
    <div key={division} style={{ marginBottom: '1rem' }}>
      <h6 className="text-primary">{division}</h6>
      {Object.keys(subdivisions).map((subDivision) => (
        <div key={subDivision} style={{ marginLeft: '1rem' }}> */}
          {/* Sub-Division Name with Checkbox */}
          {/* <CFormCheck
            key={subDivision}
            id={subDivision.toLowerCase().replace(/\s+/g, '_')}
            name={subDivision.toLowerCase().replace(/\s+/g, '_')}
            label={subDivision}
            onChange={(e) => handleMethodChange(e, 'subDivision')}
          />
        </div>
      ))}
    </div>
  ))}
</CCol>
                </React.Fragment> */}
              {/* ))} */}
              </React.Fragment> 

            </CRow>
            <hr />


            {/* Update Button */}
            <CButton color="primary" onClick={handleUpdate}>
              Update
            </CButton>
          </CForm>

          {/* <hr /> */}

          {/* Commission Update Section */}
          {/* <h5>Update Commission</h5> */}
          {/* <CForm> */}
          {/* Input field for commission */}
          {/* <CFormInput
          style={{width:"30%"}}
            type="number"
            id="commission"
            name="commission"
            label="Commission"
            value={commission}
            onChange={handleCommissionChange} 
            placeholder="Enter commission amount"
          /> */}

          {/* Update Commission Button */}
          {/* <CButton color="success" className="mt-3" onClick={handleUpdateCommission}>
            Update Commission
          </CButton>
        </CForm> */}
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default Permission;
