<GameProjectFile>
  <PropertyGroup Type="Scene" Name="mainScene" ID="a2ee0952-26b5-49ae-8bf9-4f1d6279b798" Version="2.3.2.3" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="15" Speed="1.0000">
        <Timeline ActionTag="1495510250" Property="Position">
          <PointFrame FrameIndex="0" X="245.0000" Y="169.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="15" X="245.0000" Y="169.0000">
            <EasingData Type="2" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="1495510250" Property="Scale">
          <ScaleFrame FrameIndex="0" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="1.0000" Y="1.0000">
            <EasingData Type="2" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="15" X="0.4444" Y="0.3846">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="1495510250" Property="RotationSkew">
          <ScaleFrame FrameIndex="0" X="0.0000" Y="-0.0026">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="360.0000" Y="359.9980">
            <EasingData Type="2" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="15" X="360.0000" Y="359.9961">
            <EasingData Type="0" />
          </ScaleFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="rot" StartIndex="0" EndIndex="15">
          <RenderColor A="255" R="85" G="107" B="47" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Scene" ctype="GameNodeObjectData">
        <Size X="960.0000" Y="640.0000" />
        <Children>
          <AbstractNodeData Name="Default" ActionTag="953446860" Alpha="126" Tag="5" IconVisible="False" ctype="SpriteObjectData">
            <Size X="960.0000" Y="640.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="480.0000" Y="320.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="HelloWorld.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
          <AbstractNodeData Name="hall_pop_window_bg_1" ActionTag="1495510250" Tag="7" FrameEvent="animcall" RotationSkewY="-0.0026" IconVisible="False" LeftMargin="200.0000" RightMargin="670.0000" TopMargin="393.0000" BottomMargin="91.0000" ctype="SpriteObjectData">
            <Size X="90.0000" Y="156.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="245.0000" Y="169.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.2552" Y="0.2641" />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hall_pop_window_bg.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameProjectFile>