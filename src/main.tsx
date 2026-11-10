import React,{Component,type ReactNode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App';import './style.css';
class AppBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<div className="recovery"><h1>집을 불러오지 못했어요</h1><p>WebGL 지원과 브라우저 설정을 확인하고 다시 시도해주세요.</p><p>저장된 가구 데이터는 브라우저에 남아 있습니다.</p><button onClick={()=>location.reload()}>다시 불러오기</button></div>:this.props.children}
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><AppBoundary><App/></AppBoundary></React.StrictMode>);
