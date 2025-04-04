import Layout from '../components/Layout';

function Home() {
  return (
    <Layout>
      <div className="text-center">
        <h1 className="mb-4">Welcome to TaskMaster ✅</h1>
        <p className="lead">Organize your tasks. Stay productive. Crush your goals.</p>
        <img src="home_page_img.png"  alt="TaskMaster Illustration" className="img-fluid mx-auto d-block mt-4" style={{ maxWidth: '80%', height: 'auto' }}/>
      </div>
    </Layout>
  );
}

export default Home;