<GameProjectFile>
  <PropertyGroup Type="Layer" Name="uiTest" ID="eead1b2e-8f7c-4e94-85c3-ff850605947d" Version="2.3.2.3" />
  <Content ctype="GameProjectContent">
    <Content>
      <Animation Duration="15" Speed="1.0000">
        <Timeline ActionTag="-1361303390" Property="Position">
          <PointFrame FrameIndex="0" X="245.0000" Y="169.0000">
            <EasingData Type="0" />
          </PointFrame>
          <PointFrame FrameIndex="10" X="245.0000" Y="169.0000">
            <EasingData Type="2" />
          </PointFrame>
        </Timeline>
        <Timeline ActionTag="-1361303390" Property="Scale">
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
        <Timeline ActionTag="-1361303390" Property="RotationSkew">
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
          <RenderColor A="150" R="255" G="0" B="0" />
        </AnimationInfo>
      </AnimationList>
      <ObjectData Name="Layer" Tag="3" ctype="GameLayerObjectData">
        <Size X="480.0000" Y="320.0000" />
        <Children>
          <AbstractNodeData Name="Image" ActionTag="-959233040" Tag="6" IconVisible="False" PercentWidthEnable="True" PercentHeightEnable="True" PercentWidthEnabled="True" PercentHeightEnabled="True" HorizontalEdge="BothEdge" VerticalEdge="BothEdge" LeftMargin="38.4000" RightMargin="38.4000" TopMargin="27.2000" BottomMargin="27.2000" Scale9Width="960" Scale9Height="640" ctype="ImageViewObjectData">
            <Size X="403.2000" Y="265.6000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="240.0000" Y="160.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5000" Y="0.5000" />
            <PreSize X="0.8400" Y="0.8300" />
            <FileData Type="Normal" Path="HelloWorld.png" Plist="" />
          </AbstractNodeData>
          <AbstractNodeData Name="hall_pop_window_bg_1" ActionTag="-1361303390" Tag="6" RotationSkewY="-0.0026" IconVisible="False" LeftMargin="200.0000" RightMargin="190.0000" TopMargin="73.0000" BottomMargin="91.0000" ctype="SpriteObjectData">
            <Size X="90.0000" Y="156.0000" />
            <AnchorPoint ScaleX="0.5000" ScaleY="0.5000" />
            <Position X="245.0000" Y="169.0000" />
            <Scale ScaleX="1.0000" ScaleY="1.0000" />
            <CColor A="255" R="255" G="255" B="255" />
            <PrePosition X="0.5104" Y="0.5281" />
            <PreSize X="0.0000" Y="0.0000" />
            <FileData Type="Normal" Path="hall_pop_window_bg.png" Plist="" />
            <BlendFunc Src="770" Dst="771" />
          </AbstractNodeData>
        </Children>
      </ObjectData>
    </Content>
  </Content>
</GameProjectFile>