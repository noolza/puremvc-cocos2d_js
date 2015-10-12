<GameProjectFile>
  <PropertyGroup Type="Layer" Name="theme" ID="d184e427-2c3e-43d3-a0ba-f0432ffb827f" Version="2.3.2.3" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="10" Speed="1.0000" ActivedAnimationName="rot">
        <Timeline ActionTag="189327528" Property="Position">
          <PointFrame FrameIndex="0" X="65.0000" Y="63.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="10" X="65.0000" Y="63.0000">
            <EasingData Type="2" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="189327528" Property="Scale">
          <ScaleFrame FrameIndex="0" X="1.0000" Y="1.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="1.0000" Y="1.0000">
            <EasingData Type="2" />
          </ScaleFrame>
        </Timeline>
        <Timeline ActionTag="189327528" Property="RotationSkew">
          <ScaleFrame FrameIndex="0" X="0.0000" Y="0.0000">
            <EasingData Type="0" />
          </ScaleFrame>
          <ScaleFrame FrameIndex="10" X="360.0000" Y="359.9980">
            <EasingData Type="2" />
          </ScaleFrame>
        </Timeline>
      </Animation>
      <AnimationList>
        <AnimationInfo Name="rot" StartIndex="0" EndIndex="10">
          <RenderColor A="150" R="135" G="206" B="235" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Layer" ctype="GameLayerObjectData">
        <Size X="128.0000" Y="128.0000" />
        <Children>
          <AbstractNodeData Name="hall_pop_window_bg_1" ActionTag="189327528" Tag="2" RotationSkewX="360.0000" RotationSkewY="359.9980" IconVisible="False" LeftMargin="20.0000" RightMargin="18.0000" TopMargin="-13.0000" BottomMargin="-15.0000" ctype="SpriteObjectData">
            <Size X="90.0000" Y="156.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="65.0000" Y="63.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5078" Y="0.4922" />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hall_pop_window_bg.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameProjectFile>