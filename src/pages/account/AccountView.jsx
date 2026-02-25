import Button from '@components/ui/Button.jsx';
import DatepickerBox from '@components/ui/DatepickerBox.jsx';
import MenuInputBox from '@components/ui/MenuInputBox.jsx';
import http from '@lib/http.js';
import AccountAddModal from '@pages/account/AccountAddModal.jsx';
import AccountGrid from '@pages/account/AccountGrid.jsx';
import { useEffect, useState } from 'react';

export default function CommonCode() {
  const [accountData, setAccountData] = useState([]);
  const [selectedAccessData, setSelectedAccessData] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    ipAddr: '',
    memoCn: '',
    useYn: '',
    rgtrId: '',
    startRegDt: null,
    endRegDt: null,
    mdfrId: '',
    startMdfcnDt: null,
    endMdfcnDt: null,
  });

  useEffect(() => {
    fetchAccounts(null, true);
  }, []);

  //접속허용 IP 목록 조회
  const fetchAccounts = async () => {
    try {
      const response = await http.get(`/api/v1/access-allowIp`, {
        params: { size: 20, ...searchParams },
      });

      const data = (response.data?.data || []).map((item) => ({
        ...item,
        id: item.mngrPrmIpNo,
      }));
      setAccountData(data);
    } catch (error) {
      console.error('접속 허용 IP 조회 실패:', error);
      setAccountData([]);
    }
  };

  const handleAccountSearch = () => {
    fetchAccounts(searchParams);
    console.log(searchParams);
  };

  const handleAccountDelete = async (row) => {
    try {
      const response = await http.patch(
        `/api/v1/access-allowIp/${row.mngrPrmIpNo}`
      );

      fetchAccounts();

      const accessData = response.data;
      setSelectedAccessData(accessData);
    } catch (error) {
      console.error('접속 허용 IP 조회 실패:', error);
    }
  };

  const handleSave = async (formData) => {
    try {
      await http.post(
        `/api/v1/access-allowIp/${formData.mngrPrmIpNo}/ips`,
        formData
      );
      alert('접속 허용 IP가 등록되었습니다.');

      setIsAddOpen(false);

      fetchAccounts(selectedAccessData);
    } catch (error) {
      console.error('접속 허용 IP 저장 실패:', error);

      const errorMessage =
        error.response?.data?.message || '접속 허용 IP 저장에 실패했습니다.';
      alert(errorMessage);
    }
  };

  const handleInputChange = (name, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setIsAddOpen(true);
  };

  return (
    <div className="oncontentbox full">
      <div className="oncontentTitle">
        <h2>접속허용 IP 관리</h2>
        <ul className="onbreadcrumb">
          <li>시스템 관리</li>
          <li>시스템 설정</li>
          <li className="on">접속허용 IP 관리</li>
        </ul>
      </div>
      <div className="oncontents">
        <div className="oncontent">
          <div className="onselect-form open" style={{ minHeight: 'auto' }}>
            <div className="onparagraph">
              <MenuInputBox
                menuType="input"
                menuName="IP"
                menuSize="150px"
                value={searchParams.ipAddr}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    ipAddr: e.target.value,
                  }))
                }
              />
              <MenuInputBox
                menuType="input"
                menuName="메모"
                menuSize="300px"
                value={searchParams.memoCn}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    memoCn: e.target.value,
                  }))
                }
              />
              <MenuInputBox
                menuType="select"
                menuName="사용여부"
                menuSize="100px"
                value={searchParams.useYn}
                onChange={(e) => handleInputChange('useYn', e.target.value)}
                options={[
                  { value: 'Y', label: '사용' },
                  { value: 'N', label: '미사용' },
                ]}
              />

              <div style={{ marginLeft: 'auto' }}>
                <Button
                  btnType="menuSearch"
                  btnNames="검색"
                  onClick={handleAccountSearch}
                />
              </div>
            </div>
            <div className="onparagraph middle">
              <MenuInputBox
                menuType="input"
                menuName="등록자"
                menuSize="100px"
                value={searchParams.rgtrId}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    rgtrId: e.target.value,
                  }))
                }
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="등록일"
                  value={searchParams.startRegDt}
                  outputFormat="datetime"
                  onChange={(date) => {
                    setSearchParams({ ...searchParams, startRegDt: date });
                  }}
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.endRegDt}
                  outputFormat="datetime"
                  onChange={(date) => {
                    setSearchParams({ ...searchParams, endRegDt: date });
                  }}
                />
              </div>
              <MenuInputBox
                menuType="input"
                menuName="삭제자"
                menuSize="100px"
                value={searchParams.mdfrId}
                onChange={(e) =>
                  setSearchParams((prev) => ({
                    ...prev,
                    mdfrId: e.target.value,
                  }))
                }
              />
              <div className="ondatepickerbox">
                <DatepickerBox
                  menuName="삭제일"
                  value={searchParams.startMdfcnDt}
                  outputFormat="datetime"
                  onChange={(date) => {
                    setSearchParams({ ...searchParams, startMdfcnDt: date });
                  }}
                />
                <span className="onunit">~</span>
                <DatepickerBox
                  value={searchParams.endMdfcnDt}
                  outputFormat="datetime"
                  onChange={(date) => {
                    setSearchParams({ ...searchParams, endMdfcnDt: date });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="ontable-legend">
            <span>
              총 <b>{accountData.length}</b>건
            </span>
            <div className="onbtns">
              <Button btnType="add" btnNames="추가" onClick={handleAdd} />
            </div>
          </div>

          {isAddOpen && (
            <AccountAddModal
              onClose={() => {
                setIsAddOpen(false);
              }}
              onSave={handleSave}
              data={accountData}
              mode={'create'}
            />
          )}
          <div className="ongrid-tableform onSCrollBox">
            <AccountGrid data={accountData} onDelete={handleAccountDelete} />
          </div>
        </div>
      </div>
    </div>
  );
}
