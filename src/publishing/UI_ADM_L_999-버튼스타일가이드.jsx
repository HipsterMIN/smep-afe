import Button from "../components/ui/Button.jsx";
export default function CommonCode() {

  return (
    <div className="oncontentbox full">
      <div
        style={{
          display : 'flex',
          alignItems : 'center',
          justifyContent : 'center',
          gap : '20px',
          height : '100%'
        }}
      >
        <Button btnSize="small" bgColor="color-navy" btnNames="버튼" />
        <Button btnSize="medium" bgColor="color-blue" btnNames="버튼" />
        <Button btnSize="large" bgColor="color-gray" btnNames="버튼" />
        <Button btnSize="auto" bgColor="color-red" btnNames="버튼" />
        <Button btnSize="small" bgColor="color-light_gray" btnNames="버튼" />
        <Button btnSize="small" bgColor="color-navy" btnNames="버튼" />
        <Button btnSize="small" bgColor="color-navy" btnNames="버튼" />
        <Button btnSize="small" disabled="disabled" btnNames="버튼" />

        <Button btnSize="mx-small" bgColor="color-navy" btnNames="버튼" />
        <Button btnSize="mx-medium" bgColor="color-navy" btnNames="버튼" />
        <Button btnSize="mx-large" bgColor="color-navy" btnNames="버튼" />

        <Button btnSize="auto" bgColor="color-red" btnNames="사용안함" />
        <Button btnSize="mx-medium" bgColor="color-blue" btnNames="사용함" />
        <Button btnSize="mx-medium" bgColor="color-red" btnNames="사용안함" />

        <Button
          btnSize="auto"
          btnNames="커스텀"
          onStyle={{
            backgroundColor : '#93aa2b',
            color : '#fff',
            fontWeight : 'bold'
          }}
        />
      </div>

    </div>
  );
}
