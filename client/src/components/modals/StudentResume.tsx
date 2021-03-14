const StudentResume = (props: any) => {
  return (
    <embed
      width='100%'
      height='100%'
      src={props.selected.resume}
      type='application/pdf'
    />
  );
};

export default StudentResume;
